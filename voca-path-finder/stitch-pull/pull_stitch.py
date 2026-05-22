import os
import requests
import json
import re

# Load from environment variables — never hardcode API keys.
# Set STITCH_API_KEY and STITCH_PROJECT_ID in your shell before running.
API_KEY = os.environ.get("STITCH_API_KEY", "")
PROJECT_ID = os.environ.get("STITCH_PROJECT_ID", "")
BASE_URL = "https://stitch.googleapis.com/mcp"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))

def make_rpc_call(method, params):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params
    }
    headers = {"X-Goog-Api-Key": API_KEY}
    response = requests.post(BASE_URL, json=payload, headers=headers)
    response.raise_for_status()
    res_json = response.json()
    if "error" in res_json:
        raise Exception(f"RPC Error: {res_json['error']}")
    return res_json.get("result", {})

def sanitize_filename(name):
    # Remove spaces and replace with underscores, keep alphanumeric and underscores/hyphens
    name = re.sub(r'\s+', '_', name)
    return re.sub(r'[^a-zA-Z0-9_\-\.]', '', name)

def main():
    print(f"Creating output directory: {OUTPUT_DIR}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    screens_dir = os.path.join(OUTPUT_DIR, "screens")
    os.makedirs(screens_dir, exist_ok=True)

    print("Fetching project metadata...")
    project_result = make_rpc_call("tools/call", {
        "name": "get_project",
        "arguments": {"name": f"projects/{PROJECT_ID}"}
    })
    
    project_text = project_result.get("content", [{}])[0].get("text", "")
    project_data = json.loads(project_text)
    
    # Save layouts
    layouts = project_data.get("screenInstances", [])
    layouts_path = os.path.join(OUTPUT_DIR, "layouts.json")
    with open(layouts_path, "w") as f:
        json.dump(layouts, f, indent=2)
    print(f"Saved layouts to {layouts_path}")

    # Save design theme / tokens
    design_theme = project_data.get("designTheme", {})
    tokens_path = os.path.join(OUTPUT_DIR, "design_tokens.json")
    with open(tokens_path, "w") as f:
        json.dump(design_theme, f, indent=2)
    print(f"Saved design tokens to {tokens_path}")

    # Save design system markdown
    design_md = design_theme.get("designMd", "")
    design_md_path = os.path.join(OUTPUT_DIR, "design_system.md")
    with open(design_md_path, "w") as f:
        f.write(design_md)
    print(f"Saved design system markdown to {design_md_path}")

    print("Listing screens...")
    screens_result = make_rpc_call("tools/call", {
        "name": "list_screens",
        "arguments": {"projectId": PROJECT_ID}
    })
    
    screens_text = screens_result.get("content", [{}])[0].get("text", "")
    screens_data = json.loads(screens_text)
    screens_list = screens_data.get("screens", [])
    print(f"Found {len(screens_list)} screens. Downloading...")

    metadata = []

    for idx, screen in enumerate(screens_list):
        screen_name = screen.get("name")
        screen_title = screen.get("title")
        screen_id = screen_name.split("/")[-1]
        
        print(f"[{idx+1}/{len(screens_list)}] Fetching screen: {screen_title} ({screen_id})")
        
        try:
            screen_detail_res = make_rpc_call("tools/call", {
                "name": "get_screen",
                "arguments": {
                    "name": screen_name,
                    "projectId": PROJECT_ID,
                    "screenId": screen_id
                }
            })
            
            screen_detail_text = screen_detail_res.get("content", [{}])[0].get("text", "")
            screen_detail = json.loads(screen_detail_text)
            
            # Save metadata
            meta_entry = {
                "id": screen_id,
                "name": screen_name,
                "title": screen_title,
                "width": screen_detail.get("width"),
                "height": screen_detail.get("height"),
                "deviceType": screen_detail.get("deviceType")
            }
            metadata.append(meta_entry)

            # Download HTML Code
            html_code_info = screen_detail.get("htmlCode", {})
            download_url = html_code_info.get("downloadUrl")
            if download_url:
                code_res = requests.get(download_url)
                code_res.raise_for_status()
                
                sanitized_title = sanitize_filename(screen_title)
                filename = f"{screen_id}_{sanitized_title}.html"
                file_path = os.path.join(screens_dir, filename)
                with open(file_path, "w") as f:
                    f.write(code_res.text)
                meta_entry["local_file"] = f"screens/{filename}"
                print(f"  -> Saved HTML to {file_path}")
            else:
                print(f"  -> No downloadUrl found for screen {screen_title}")
                
        except Exception as e:
            print(f"  -> Failed to pull screen {screen_title}: {e}")

    # Save screens metadata
    meta_path = os.path.join(OUTPUT_DIR, "screens_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved screens metadata to {meta_path}")
    print("Pull complete!")

if __name__ == "__main__":
    main()
