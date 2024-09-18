import http.client
import json
import re
from tqdm import tqdm
import time

# 设置 API 密钥和 URL
API_KEY = "sk-dhizyQ5I8IQhOd9o3aD9802eEcA0470d92Eb287c611f404c"
API_HOST = "api.b3n.fun"
API_PATH = "/v1/chat/completions"
RETRY_LIMIT = 5
TIMEOUT = 30  # 设置超时时间为30秒

def split_text(text, max_length=1000):
    sentences = re.split(r'(?<=[。！？])', text)
    chunks = []
    current_chunk = ""
    for sentence in sentences:
        if len(current_chunk) + len(sentence) > max_length:
            chunks.append(current_chunk)
            current_chunk = sentence
        else:
            current_chunk += sentence
    if current_chunk:
        chunks.append(current_chunk)
    return chunks

def correct_text(text):
    conn = http.client.HTTPSConnection(API_HOST, timeout=TIMEOUT)
    payload = json.dumps({
        "model": "gpt-4o-mini",
        "max_tokens": 4096,
        "messages": [
            {"role": "system", "content": "你是一个专业中文文本纠错助手。请纠正以下文本中的错别字，只返回纠正后的文本，不要添加任何解释，也不要增加任何不必要的符号，包括换行符。如果没有错误，请原样返回文本。"},
            {"role": "user", "content": text}
        ]
    })
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        'Content-Type': 'application/json'
    }

    for attempt in range(RETRY_LIMIT):
        try:
            conn.request("POST", API_PATH, payload, headers)
            res = conn.getresponse()
            data = res.read()
            response = json.loads(data.decode("utf-8"))
            return response['choices'][0]['message']['content']
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(2 ** attempt)  # 指数退避
        finally:
            conn.close()
    raise Exception("Failed to connect to the API after several attempts")

def process_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    chunks = split_text(content)
    corrected_chunks = []

    for chunk in tqdm(chunks, desc="Processing chunks"):
        corrected_chunk = correct_text(chunk)
        corrected_chunks.append(corrected_chunk)

    corrected_content = ''.join(corrected_chunks)

    # 保存纠正后的文本
    output_file_path = file_path.rsplit('.', 1)[0] + '_corrected.md'
    with open(output_file_path, 'w', encoding='utf-8') as file:
        file.write(corrected_content)

    print(f"Corrected file saved as: {output_file_path}")

# 使用示例
markdown_file_path = r'C:\Users\Lenovo\Desktop\ebotian-blog\content\posts\2024.9\大学随笔第5本.md'  # 替换为您的 Markdown 文件路径
process_markdown_file(markdown_file_path)