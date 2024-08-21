import ollama
import sys
import re

def clean_string(s: str) -> str:
  cleaned_string = re.sub(r'\W+', '', s)
  confined_string = cleaned_string[:32]
  return confined_string

del sys.argv[0]
MAD_LIB_TOPIC = clean_string("_".join(sys.argv))

prompt = f"""

Write a 8 sentence Mad Lib with the following topic:
{MAD_LIB_TOPIC}

Use the types of blanks shown below as needed (include at least two blanks per sentence)
Do not use underscores to show blanks, use these instead:
[noun]
[verb]
[adjective]
[person_name]
[place]


Example:
BEGIN
Any text [noun] like this [verb] is an example [person_name]
END


Do not use present participle or past tense verbs in your response.

"""

stream = ollama.chat(
  model='llama3',
  messages=[{'role': 'user', 'content': prompt}],
  stream=True,
)

result = ""

for chunk in stream:
  result += chunk["message"]["content"]

print(result)