import os
import requests
import io
import traceback
import base64
import json
from PIL import Image
from worker.publisher import publish
from worker.config import Config
from worker.prompts import TRYON_PROMPT_TEMPLATE

# No google.generativeai dependency needed 

def download_image(url):
    """Downloads an image from a URL and returns a PIL Image object."""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content))
    except Exception as e:
        print(f"❌ Failed to download image from {url}: {e}")
        raise

def image_to_base64(image):
    """Converts PIL Image to base64 string."""
    buf = io.BytesIO()
    # Save as PNG to ensure compatibility and consistent format
    image.save(buf, format='PNG')
    return base64.b64encode(buf.getvalue()).decode('utf-8')

def upload_image(image_content, url):
    """Uploads image bytes to a presigned URL using PUT."""
    try:
        headers = {'Content-Type': 'image/png'} 
        response = requests.put(url, data=image_content, headers=headers, timeout=60)
        response.raise_for_status()
        print(f"✅ Upload successful ...")
    except Exception as e:
        print(f"❌ Failed to upload image: {e}")
        raise

def format_prompt(skeleton_type, gender):
    """Formats the system prompt with dynamic values."""
    gender_map = {'male': '남자', 'female': '여자', 'man': '남자', 'woman': '여자'}
    korean_gender = gender_map.get(str(gender).lower(), '남자')
    
    skeleton_map = {'wave': '웨이브 체형', 'straight': '스트레이트 체형', 'natural': '내추럴 체형'}
    korean_skeleton = skeleton_map.get(str(skeleton_type).lower(), skeleton_type)
    
    return TRYON_PROMPT_TEMPLATE.format(skeleton_type=korean_skeleton, gender=korean_gender)

def generate_tryon_gms(person_img, clothing_img, prompt):
    """Calls GMS (Gemini) API via HTTP Request."""
    
    # Convert images to base64
    person_b64 = image_to_base64(person_img)
    clothing_b64 = image_to_base64(clothing_img)
    
    url = Config.GMS_URL
    api_key = Config.GOOGLE_API_KEY
    
    headers = {
        "x-goog-api-key": api_key,
        "Content-Type": "application/json"
    }
    
    # Construct Payload matching Gemini API for multimodal
    # https://ai.google.dev/gemini-api/docs/text-generation?lang=python#multimodal
    # Construct Payload matching Gemini API
    # Adding generationConfig to force image generation behavior if supported
    # Adding safetySettings to prevent blocking
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inline_data": {
                        "mime_type": "image/png",
                        "data": person_b64
                    }
                },
                {
                     "inline_data": {
                        "mime_type": "image/png",
                        "data": clothing_b64
                    }
                }
            ]
        }],
        "generationConfig": {
            "temperature": 0.4,
            "topP": 1,
            "topK": 32,
            "maxOutputTokens": 2048,
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
    }
    
    print(f"🚀 Sending request to GMS Endpoint...")
    response = requests.post(url, headers=headers, json=payload, timeout=90)
    
    if response.status_code != 200:
        print(f"❌ GMS Error {response.status_code}: {response.text}")
        raise ValueError(f"GMS API failed: {response.text}")
        
    try:
        data = response.json()
        
        # DEBUG: Save full response to file for investigation
        import datetime
        debug_file = f"/tmp/gms_response_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(debug_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"🔍 DEBUG: Saved full GMS response to {debug_file}")
        
        # Extract Image from response
        # If the model returns an image, it usually comes as inline_data in the response candidates.
        # However, standard Gemini text-generation models return TEXT descriptions.
        # If 'gemini-2.5-flash-image' returns an image, we need to find it.
        
        # Scenario A: It returns an image in valid Gemini response format
        # candidates -> content -> parts -> inline_data
        # Function to recursively search for image data
        def find_image_data(obj):
            if isinstance(obj, dict):
                # Check for standard inline_data structure
                if "mimeType" in obj and "image" in obj["mimeType"] and "data" in obj:
                     return obj["data"]
                
                # Check for keys like "inline_data" or "inlineData"
                for key in ["inline_data", "inlineData"]:
                    if key in obj and isinstance(obj[key], dict) and "data" in obj[key]:
                        return obj[key]["data"]
                
                # Recursive search in values
                for value in obj.values():
                    res = find_image_data(value)
                    if res: return res
                    
            elif isinstance(obj, list):
                for item in obj:
                    res = find_image_data(item)
                    if res: return res
            return None

        # Search for image
        b64_data = find_image_data(data)
        
        if b64_data:
            # print("📸 Found generated image using recursive search!") # Optional Log
            try:
                return Image.open(io.BytesIO(base64.b64decode(b64_data)))
            except Exception as img_err:
                 print(f"❌ Failed to decode found image data: {img_err}")

        # Fallback to text extraction if no image found
        text_content = ""
        try:
            parts = data.get("candidates", [])[0].get("content", {}).get("parts", [])
            for part in parts:
                 if "text" in part:
                     text_content += part["text"]
        except:
            pass

        print(f"ℹ️ Received Text Response: {text_content[:100]}...")
        
        # DEBUG: Print full response if we still failed
        if not b64_data:
            print("🔍 FULL GMS RESPONSE DEBUG (No Image Found):")
            # Print top-level structure to avoid huge log if possible, but user wants full
            print(json.dumps(data, indent=2, ensure_ascii=False)[:3000]) # Print first 3000 chars
            
        if not text_content and not b64_data:
            raise ValueError("Empty response from GMS")
            
            #raise ValueError("Model returned text instead of image. Check model capability.")
            
            # [FALLBACK FOR DEMO/TESTING]
            # If the model is purely text-based but user expects logic to pass,
            # we return the person image to avoid crash, BUT print huge warning.
            print("⚠️ WARNING: No image generated by AI. Using input image as placeholder to verify pipeline.")
            return person_img

    except Exception as e:
        print(f"❌ Parsing response failed: {e}")
        # print full response for debug
        print(data)
        raise

def handle(message: dict):
    print(f"Processing message: {message}")
    report_id = message.get("reportId")
    
    if not Config.GOOGLE_API_KEY:
         publish({
            "report_id": report_id,
            "status": "FAILED",
            "error": "Worker configuration error: GOOGLE_API_KEY missing"
        })
         return

    try:
        # Extract URLs
        best_upload_url = message.get("bestResultUploadUrl")
        worst_upload_url = message.get("worstResultUploadUrl")
        person_url = message.get("presignedUrl")
        best_clothing_url = message.get("bestClothingPresignedUrl")
        worst_clothing_url = message.get("worstClothingPresignedUrl")
        
        gender = message.get("gender", "male")
        skeleton_type = message.get("skeletonType", "Wave")
        
        if not person_url:
             raise ValueError("presignedUrl (Person) is missing")

        final_prompt = format_prompt(skeleton_type, gender)
        print(f"📝 Prompt prepared for {gender}, {skeleton_type}")
        
        # DEBUG: Print URLs to verify they are different
        print(f"🔍 DEBUG - Best clothing URL: {best_clothing_url}")
        print(f"🔍 DEBUG - Worst clothing URL: {worst_clothing_url}")

        results = {}
        person_img = download_image(person_url)
        
        # PROCESS BEST
        if best_clothing_url and best_upload_url:
            print("👕 Processing BEST outfit...")
            clothing_img = download_image(best_clothing_url)
            # CALL GMS
            result_img = generate_tryon_gms(person_img, clothing_img, final_prompt)
            
            # Save & Upload
            buf = io.BytesIO()
            result_img.save(buf, format='PNG')
            upload_image(buf.getvalue(), best_upload_url)
            results["best"] = "Uploaded"
            
        # PROCESS WORST
        if worst_clothing_url and worst_upload_url:
            print("👕 Processing WORST outfit...")
            clothing_img = download_image(worst_clothing_url)
            # CALL GMS
            result_img = generate_tryon_gms(person_img, clothing_img, final_prompt)
            
            # Save & Upload
            buf = io.BytesIO()
            result_img.save(buf, format='PNG')
            upload_image(buf.getvalue(), worst_upload_url)
            results["worst"] = "Uploaded"

        publish({
            "report_id": report_id,
            "status": "COMPLETE"
        })
        print("✅ Processing completed.")
        
    except Exception as e:
        print(f"❌ Error in handle: {e}")
        traceback.print_exc()
        publish({
            "report_id": report_id,
            "status": "FAILED",
            "error": str(e)
        })
