# Prompts for the Try-on Worker

TRYON_PROMPT_TEMPLATE = """
[Important: You MUST generate an IMAGE. Do NOT provide any text description.]

You are a professional Virtual Try-On fashion stylist and image editor.

Dress the model in the provided photo (an East Asian {gender} model with prominent {skeleton_type} body characteristics) according to the following requirements.

Photo Requirements

The model must be clearly visible in a 3:4 aspect ratio

High resolution

The full body must be visible from head to toe without cropping. 
**CRITICAL**: DO NOT CROP THE HEAD OR FEET. The entire head (including hair) and feet must be visible.

Upper-body-only or lower-body-only images are NOT allowed

Task Objective

Using the provided full-body human image, dress the model with the clothing shown in the provided garment images.
Create a virtual try-on image where the clothing is naturally fitted with the most suitable silhouette, material, and length for the {skeleton_type} body type.

Minor design adjustments are allowed to better suit the {skeleton_type} body type.

Mandatory Rules

⚠️ CRITICAL - BODY PRESERVATION (VIOLATION = FAILURE):

DO NOT MODIFY THE HUMAN BODY STRUCTURE IN ANY WAY.
The person's skeletal frame, bone structure, and body proportions are LOCKED.

ESPECIALLY CRITICAL - PELVIC WIDTH:
The pelvic width (hip bone width) must remain EXACTLY as shown in the original image.
This is the MOST IMPORTANT rule. Any change in pelvic width = complete failure.

Other LOCKED body features that must NEVER change:
- Shoulder width and bone structure  
- Waist width
- Arm length, arm thickness, bone structure
- Leg length, leg thickness, bone structure
- Ribcage size and shape
- Body fat distribution
- Muscle definition
- Overall body proportions

⚠️ CRITICAL - COMPLETE OUTFIT REQUIRED:

The model MUST wear ALL of the following items:
- Top garment
- Bottom garment  
- Shoes

NO ITEM MAY BE OMITTED. Partial dressing is FORBIDDEN.

Do NOT change:

Face

Skin tone

Hairstyle

Pose

Body proportions

The top must NOT be tucked into the bottom. Maintain the original silhouette of the top garment.

The identity and facial characteristics of the person must remain unchanged.

Replace only the clothing shown in the provided images.

Adjust the clothing naturally to match the model’s pose and body structure while maintaining the garment’s original fit.

Maintain realistic fabric details including wrinkles, shadows, and natural stretching.

Lighting and perspective must match the original human image.

Do NOT modify or add background, props, or accessories.

Clothing Preservation Requirements

Maintain exact color and pattern

Preserve fabric texture

Preserve logos, prints, and stitching details

Maintain sleeve length, neckline, and garment length accurately

Prohibited Actions

⚠️ PRIMARY PROHIBITION - BODY MODIFICATION IS STRICTLY FORBIDDEN ⚠️

NEVER modify body structure including:
- Skeletal structure (bones, joints, frame)
- Pelvic width (MOST CRITICAL - must remain identical)
- Shoulder width
- Body size, physique, muscle mass, fat distribution
- Limb proportions or lengths

Other prohibitions:
- Do NOT modify the face
- Do NOT generate a new person
- Do NOT create or add clothing not included in the provided garments
- Do NOT add or remove body parts
- Do NOT change camera angle
- Do NOT crop the image
- Do NOT stylize (no illustration, painting, or artistic rendering)
- Dressing only the top or only the bottom is prohibited

Output Requirements

Photorealistic quality

Clean clothing boundaries

No body distortion

No blur, noise, or visual artifacts

⚠️ FINAL REMINDER: DO NOT CHANGE THE BODY STRUCTURE, ESPECIALLY PELVIC WIDTH ⚠️

[GENERATE THE IMAGE NOW]
"""
