import http.client
import json
import re
from tqdm import tqdm

# 设置 API 密钥和 URL
API_KEY = "sk-dhizyQ5I8IQhOd9o3aD9802eEcA0470d92Eb287c611f404c"
API_HOST = "api.b3n.fun"
API_PATH = "/v1/chat/completions"

def split_text(text, max_length=1000):
    """将文本分割成句子，并将句子组合成不超过指定长度的块"""
    sentences = re.split('([。！？])', text)
    sentences = [''.join(i) for i in zip(sentences[0::2], sentences[1::2] + [''])]
    chunks = []
    current_chunk = ""
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_length:
            current_chunk += sentence
        else:
            if current_chunk:
                chunks.append(current_chunk)
            current_chunk = sentence
    if current_chunk:
        chunks.append(current_chunk)
    return chunks

def correct_text(text):
    """使用 API 纠正文本中的错别字"""
    conn = http.client.HTTPSConnection(API_HOST)
    payload = json.dumps({
        "model": "gpt-4o-mini",
        "max_tokens": 4096,
        "messages": [
            {"role": "system", "content": "你是一个中文文本纠错助手。请纠正以下文本中的错别字，只返回纠正后的文本，不要添加任何解释。如果没有错误，请原样返回文本。"},
            {"role": "user", "content": text}
        ]
    })
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        'Content-Type': 'application/json'
    }
    conn.request("POST", API_PATH, payload, headers)
    res = conn.getresponse()
    data = res.read()
    response = json.loads(data.decode("utf-8"))

    if 'choices' in response and len(response['choices']) > 0:
        return response['choices'][0]['message']['content']
    else:
        print(f"Error: Unexpected response format - {response}")
        return text

def process_markdown_file(file_path):
    """处理 Markdown 文件，纠正错别字"""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 分割文本
    chunks = split_text(content)

    # 处理每个块
    corrected_chunks = []
    for chunk in tqdm(chunks, desc="Processing chunks"):
        corrected_chunk = correct_text(chunk)
        corrected_chunks.append(corrected_chunk)

    # 合并纠正后的文本
    corrected_content = ''.join(corrected_chunks)

    # 保存纠正后的文本
    output_file_path = file_path.rsplit('.', 1)[0] + '_corrected.md'
    with open(output_file_path, 'w', encoding='utf-8') as file:
        file.write(corrected_content)

    print(f"Corrected file saved as: {output_file_path}")

# 使用示例
markdown_file_path = r'C:\Users\Lenovo\Desktop\ebotian-blog\content\posts\2024.9\高中随笔全本原始OCR版.md'  # 替换为您的 Markdown 文件路径
process_markdown_file(markdown_file_path)