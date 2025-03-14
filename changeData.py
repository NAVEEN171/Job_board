import json

input_file_path = "E:\\joby_db.jobs.json"
output_file_path = "E:\\jobs_result.json"

with open(input_file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

for item in data:
    if "_id" in item:
        del item["_id"]

with open(output_file_path, 'w', encoding='utf-8') as file:
    json.dump(data, file, indent=2)

print(f"Processed {len(data)} items. Result saved to {output_file_path}")