import os
import subprocess
import sys
import signal
import time

def run_workers():
    # 1. Select Environment File
    env_file = input("Select environment file [.env / .env.local] (default: .env): ").strip()
    if not env_file:
        env_file = ".env"
    
    if not os.path.exists(env_file):
        print(f"❌ Error: File '{env_file}' not found.")
        return

    # Resolve absolute path to ensure workers can find it regardless of CWD
    env_file = os.path.abspath(env_file)
    print(f"✅ Using environment file: {env_file}")
    
    # Set ENV_FILE so workers can pick it up
    os.environ["ENV_FILE"] = env_file

    # 2. Define Worker Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Assuming code is in ai/workers/run_workers.py, so we align relative to ai/
    # If this file is placed in ai/workers/, then path is correct.
    
    body_worker_script = os.path.join(base_dir, "body-worker", "main.py")
    tryon_worker_script = os.path.join(base_dir, "tryon-worker", "main.py")

    processes = []

    try:
        # 3. Start Body Worker
        print(f"🚀 Starting Body Worker...")
        p1 = subprocess.Popen([sys.executable, body_worker_script], env=os.environ.copy())
        processes.append(p1)

        # 4. Start Try-on Worker
        print(f"🚀 Starting Try-on Worker...")
        p2 = subprocess.Popen([sys.executable, tryon_worker_script], env=os.environ.copy())
        processes.append(p2)

        print("\n✨ All workers started. Press Ctrl+C to stop.\n")
        
        # Keep alive
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n🛑 Stopping workers...")
        for p in processes:
            p.terminate()
            
    except Exception as e:
        print(f"❌ Error: {e}")
        for p in processes:
            p.terminate()

if __name__ == "__main__":
    run_workers()
