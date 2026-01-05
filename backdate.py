import os
import random
import subprocess
import datetime
import time

# Configuration
REPO_ROOT = os.getcwd()
REMOTE_URL = "https://github.com/rajaganapathi672/FEEDBACK-"
START_DATE = datetime.datetime(2026, 1, 3, 9, 0, 0)
END_DATE = datetime.datetime(2026, 1, 12, 18, 0, 0)
TARGET_COMMITS = 80
EXCLUDES = {'.git', 'node_modules', '.vercel', 'dist', 'build', 'coverage', '.env'}

def run_command(command, env=None):
    result = subprocess.run(command, shell=True, cwd=REPO_ROOT, env=env, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running command: {command}")
        print(result.stderr)
        return False
    return True

def get_files():
    file_list = []
    for root, dirs, files in os.walk(REPO_ROOT):
        # Filter directories
        dirs[:] = [d for d in dirs if d not in EXCLUDES]
        
        for file in files:
            if file.startswith('.'): continue
            filepath = os.path.join(root, file)
            # relative path for git
            rel_path = os.path.relpath(filepath, REPO_ROOT)
            file_list.append(rel_path)
    return file_list

def generate_timestamps(n, start, end):
    timestamps = []
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    
    for _ in range(n):
        random_second = random.randrange(int_delta)
        dt = start + datetime.timedelta(seconds=random_second)
        # Limit to working hours (9am - 8pm) roughly to look realistic?
        # User didn't specify, but "per day count" implies spread.
        # Simple random distribution is fine.
        timestamps.append(dt)
    
    timestamps.sort()
    return timestamps

def main():
    print("Preparing to backdate commits...")
    
    # 1. Reset Git Info
    if os.path.isdir(os.path.join(REPO_ROOT, ".git")):
        import shutil
        try:
             shutil.rmtree(os.path.join(REPO_ROOT, ".git"))
        except Exception as e:
             print(f"Failed to delete .git: {e}")
    
    run_command("git init")
    run_command(f"git remote add origin {REMOTE_URL}")
    run_command("git checkout -b main") # Ensure branch is main

    all_files = get_files()
    print(f"Found {len(all_files)} files.")
    
    actions = []
    # Initial commits for all files
    for f in all_files:
        actions.append({"type": "create", "file": f})
        
    # Add update actions if needed to reach TARGET_COMMITS
    needed = TARGET_COMMITS - len(actions)
    if needed > 0:
        print(f"Adding {needed} update commits to reach target.")
        # Filter for text files to update safely
        text_files = [f for f in all_files if f.endswith(('.md', '.txt', '.js', '.ts', '.css', '.html', '.json'))]
        if not text_files: text_files = all_files
        
        for _ in range(needed):
            target_file = random.choice(text_files)
            actions.append({"type": "update", "file": target_file})
    
    # Generate Timestamps
    timestamps = generate_timestamps(len(actions), START_DATE, END_DATE)
    
    # Assign timestamps to actions
    # We need to ensure 'create' comes before 'update' for the same file.
    # We can just process actions in order? No, timestamps are sorted.
    # We need to map (file, type) -> timestamp.
    
    # Better: Shuffle actions (preserve local relative order? no, global shuffle is risky).
    # Strategy: 
    # 1. Assign random timestamps to ALL actions.
    # 2. Sort actions by timestamp.
    # 3. If an 'update' appears before 'create' for a file, swap their timestamps.
    
    # Let's attach timestamps to objects first
    commit_plan = []
    for i, action in enumerate(actions):
        commit_plan.append({
            "action": action,
            "ts": timestamps[i] # This is sorted, but `actions` is creates then updates.
            # So all updates would be at the end. That implies updates happen strictly after all creates.
            # That's actually fine and safe!
            # It simulates: "Build mostly everything, then tweak."
            # But maybe we want some updates mixed in?
            # To mix, we can shuffle `actions` but then we need to repair order.
        })
    
    # Let's shuffle the plan and then repair.
    # Actually, simplistic approach: creates first, then updates.
    # But creates can be spread over the 10 days?
    # If I sort timestamps, and map creates to first N timestamps... then creates are Jan 3-8, updates Jan 9-12.
    # A bit artificial.
    
    # Better:
    # Assign random float (0-1) Position to each file.
    # Create action happens at Position.
    # Update action happens at Position + small delta.
    # Scale to time range.
    
    final_plan = []
    file_positions = {f: random.random() for f in all_files}
    
    for action in actions:
        f = action['file']
        pos = file_positions[f]
        if action['type'] == 'update':
            pos += 0.05 # slightly later
            # re-randomize file position for multiple updates?
            file_positions[f] += 0.05
        
        # Map pos 0-1.5 to Start-End date?
        # Just use pos as a sort key.
        final_plan.append({"action": action, "sort_key": pos})
        
    final_plan.sort(key=lambda x: x['sort_key'])
    
    # Now assign the sorted valid timestamps
    for i, item in enumerate(final_plan):
        item['ts'] = timestamps[i]

    print("Executing commits...")
    env = os.environ.copy()
    
    for i, item in enumerate(final_plan):
        action = item['action']
        ts = item['ts']
        f = action['file']
        
        # Format date for git
        # "YYYY-MM-DD HH:MM:SS"
        date_str = ts.strftime("%Y-%m-%d %H:%M:%S")
        env['GIT_AUTHOR_DATE'] = date_str
        env['GIT_COMMITTER_DATE'] = date_str
        
        # 1. Stage the file
        # If it's an update, we assume we append a newline
        if action['type'] == 'update':
            try:
                with open(os.path.join(REPO_ROOT, f), 'a') as file_handle:
                   file_handle.write('\n')
            except Exception as e:
                print(f"Skipping update for {f}: {e}")
                continue

        run_command(f'git add "{f}"')
        
        # 2. Commit
        # Message = file name
        msg = f
        
        print(f"[{i+1}/{TARGET_COMMITS}] {date_str} - {action['type']} {f}")
        run_command(f'git commit -m "{msg}"', env=env)

    print("Pushing to remote...")
    run_command("git push -u origin main --force")
    print("Done!")

if __name__ == "__main__":
    main()
