import os
import subprocess
from datetime import datetime

def get_git_creation_date(file_path):
    try:
        git_log = subprocess.check_output(['git', 'log', '--follow', '--format=%ad', '--date=short', '--reverse', file_path]).decode('utf-8')
        if git_log:
            return git_log.split('\n')[0]  # 返回最早的日期
    except subprocess.CalledProcessError:
        pass
    return None

def parse_date(date_string):
    try:
        return datetime.strptime(date_string, '%Y-%m-%d')
    except ValueError:
        return None

def update_file_with_date(file_path):
    git_date = get_git_creation_date(file_path)
    if not git_date:
        print(f"无法获取 git 日期: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    lines = content.split('\n')
    existing_date = None
    if lines and lines[0].startswith('---'):
        for line in lines[1:]:
            if line.startswith('---'):
                break
            if line.startswith('date:'):
                existing_date = line.split(':', 1)[1].strip()
                break

    git_date_obj = parse_date(git_date)
    existing_date_obj = parse_date(existing_date) if existing_date else None

    if existing_date_obj and existing_date_obj < git_date_obj:
        final_date = existing_date
    else:
        final_date = git_date

    if existing_date:
        # 更新现有的日期
        new_content = content.replace(f'date: {existing_date}', f'date: {final_date}', 1)
    else:
        # 添加新的日期格式
        new_content = f'---\ndate: {final_date}\n---\n\n{content}'

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(new_content)

    print(f"更新了文件: {file_path}")

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                update_file_with_date(file_path)

# 使用示例
target_directory = r'C:\Users\Lenovo\Desktop\ebotian-blog\content\posts'  # 替换为您的目标文件夹路径
process_directory(target_directory)