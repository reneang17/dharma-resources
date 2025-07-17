import re
import os
import json
import subprocess

#Full path to where the books are
path = "./ajahn_munindo_books/"


#
reflexions_1 = "Dhammapada-Reflections-Volume-1-Ajahn-Munindopdf.pdf"
reflexions_2 = "Dhammapada_Reflections_Volume_2_-_Ajahn_Munindo.pdf"
reflexions_3 = "Dhammapada%20Reflections%20Volume%203%20-%20Ajahn%20Munindo.pdf"


def handle_exceptions(num):
    if num == "004": num = "003"
    if num == "008": num = "007"
    if num == "010": num = "009"
    if num == "012": num = "011"
    if num == "014": num = "013"
    if num == "020": num = "019"
    if num in ["022","023"]: num = "021"
    if num == "027": num = "026"
    if num == "034": num = "033"
    if num == "039": num = "038"
    if num == "045": num = "044"
    if num == "052": num = "051"
    if num == "055": num = "054"
    if num == "059": num = "058"
    if num == "074": num = "073"
    if num == "086": num = "085"
    if num in ["088","089"]: num = "087"
    if num == "103": num = "102"
    if num == "105": num = "104"
    if num == "120": num = "119"
    if num == "132": num = "131"
    if num == "134": num = "133"
    if num in ["138","139","140"]: num = "137"
    if num == "144": num = "143"
    if num == "154": num = "153"
    if num == "156": num = "155"
    if num == "169": num = "168"
    if num == "180": num = "179"
    if num in ["184","185"]: num = "193"
    if num == "187": num = "186"
    if num in ["189","190","191","192"]: num = "188"
    if num == "196": num = "195"
    if num in ["198","199"]: num = "197"
    if num in ["207","208"]: num = "206"
    if num in ["210","211"]: num = "209"
    if num == "220": num = "219"
    if num in ["228","229","230"]: num = "227"
    if num in ["232","233","234"]: num = "231"
    if num in ["236","237","238"]: num = "235"
    if num == "243": num = "242"
    if num == "245": num = "244"
    if num in ["247","248"]: num = "246"
    if num == "250": num = "249"
    if num == "255": num = "254"
    if num == "257": num = "256"
    if num == "261": num = "260"
    if num == "263": num = "262"
    if num == "265": num = "264"
    if num == "267": num = "266"
    if num == "269": num = "268"
    if num == "272": num = "271"
    if num in ["274","275","276"]: num = "273"
    if num in ["278","279"]: num = "277"
    if num == "284": num = "283"
    if num == "293": num = "292"
    if num == "295": num = "294"
    if num in ["297","298","299","300","301"]: num = "296"
    if num == "310": num = "309"
    if num in ["312","313"]: num = "311"
    if num == "317": num = "316"
    if num == "319": num = "318"
    if num in ["321","322"]: num = "320"
    if num in ["329","330"]: num = "328"
    if num in ["332","333"]: num = "331"
    if num in ["335","336","337"]: num = "334"
    if num in ["339","340","341","342","343"]: num = "338"
    if num == "346": num = "345"
    if num == "350": num = "349"
    if num == "352": num = "351"
    if num in ["357","358","359"]: num = "356"
    if num == "361": num = "360"
    if num == "366": num = "365"
    if num in [str(i) for i in range(369,377)]: num = "368"
    if num == "380": num = "379"
    if num == "390": num = "389"
    if num == "420": num = "419"
    return num

def handle_joined_verses(line):
    if line == "58.\n": return "58-59.\n"
    if line == "73.\n": return "73-74.\n"
    if line == "87.\n": return "87-88.\n"
    if line == "104.\n": return "104-105.\n"
    if line == "137.\n": return "137-140.\n"
    if line == "153.\n": return "153-154.\n"
    if line == "186.\n": return "186-187.\n"
    if line == "188.\n": return "188-189.\n"
    if line == "190.\n": return "190-191.\n"
    if line == "195.\n": return "195-196.\n"
    if line == "219.\n": return "219-220.\n"
    if line == "246.\n": return "246-247.\n"
    if line == "249.\n": return "249-250.\n"
    if line == "262.\n": return "262-263.\n"
    if line == "268.\n": return "268-269.\n"
    if line == "271.\n": return "271-272.\n"
    if line == "288.\n": return "288-289.\n"
    if line == "345.\n": return "345-346.\n"
    if line == "375.\n": return "375-376.\n"
    return line



file_path_1 = "./reflections_1.txt"
with open(file_path_1, "r") as file_c1:
    file_c1_lines = list(file_c1)

file_path_2 = "./reflections_2.txt"
with open(file_path_2, "r") as file_c2:
    file_c2_lines = list(file_c2)

file_path_3 = "./reflections_3.txt"
with open(file_path_3, "r") as file_c3:
    file_c3_lines = list(file_c3)
    
file_path_4 = "./reflections_4.txt"
with open(file_path_4, "r") as file_c4:
    file_c4_lines = list(file_c4)

    
def get_ref(verse):
    refs = ''
    urls = ''
    for file_lines in [file_c1_lines, file_c2_lines, file_c3_lines, file_c4_lines]:
        for i, line in enumerate(file_lines):
            if verse == line:
                
                if file_lines == file_c1_lines:
                    ref = file_lines[i+1][:-1] + " of Dhammapada Reflections Vol. 1.\n"
                    n = int(file_lines[i+1][9:-1]) + 17
                    url = path + reflexions_1 + "#page=" + str(n) + "\n"

                if file_lines == file_c2_lines:
                    ref = file_lines[i+1][:-1] + " of Dhammapada Reflections Vol. 2.\n"
                    n = int(file_lines[i+1][9:-1]) + 8
                    url = path + reflexions_2 + "#page=" + str(n) + "\n"

                if file_lines == file_c3_lines:
                    ref = file_lines[i+1][:-1] + " of Dhammapada Reflections Vol. 3.\n"
                    n = int(file_lines[i+1][9:-1]) + 12
                    url = path + reflexions_3 + "#page=" + str(n) + "\n"
                    
                if file_lines == file_c4_lines:
                    url= file_lines[i+1][:-1] + "\n"
                    url_=((file_lines[i+1][:-1]).split("/")[-1].split("moon")[-1]).replace("-"," ")
                    if url_[0] == ' ':
                        url_ = url_[1:]
                    url_ = url.capitalize()
                    ref=url_ + " - at ratanagiri.org.uk\n"
                refs+=ref
                urls+= url
                    
    print(refs[:-1], urls[:-1])

    return refs[:-1], urls[:-1]


file_path = "./Dhammapada.txt"
with open(file_path, "r") as file:
    file_lines = list(file)

verses = []
for i, line in enumerate(file_lines):
    if line[0] == "#":
        chapter = line[1:-1]

    elif line[0].isdigit():
        #Extract verse number
        num = line[:-2]

        if len(num) == 1:
            num = "00" + num
        if len(num) == 2:
            num = "0" + num

        #Get link string
        aux_num = handle_exceptions(num)
        context = "https://www.tipitaka.net/tipitaka/dhp/verseload.php?verse="+aux_num

        #Verse id
        id = int(line[:-2])
        
        verse_string = handle_joined_verses(line)
        
        if "-" in verse_string:
            tmp = verse_string.split("-")
            n = 1+int(tmp[1][:-2]) - int(tmp[0])
        else:
            n = 1
        
    
        refs , urls = get_ref(verse_string)
        
        
        #verse_string = verse_string[:-1] # Remove final line break
        
        
        #We append n times the same verse.
        for _ in range(0,n):
            if refs == '':
                verses.append((id, chapter, verse_string, context))
            else:
                verses.append((id, chapter, verse_string, context, refs, urls))
            id+=1

messages = []

for v in verses:
    if len(v)==6:
        messages.append({"id": v[0], "ch": v[1], "verse": v[2][:-1], "context": [v[3]], "refs": (v[4]).split("\n"), "urls": (v[5]).split("\n")})
    elif len(v)==4:
        messages.append({"id": v[0], "ch": v[1], "verse": v[2][:-1], "context": [v[3]], "refs": [], "urls": []})


for m in messages:
    
    verse_1 = m["id"]
    link_1 = m["context"]
    utter = [verse_1]
    
    for n in messages:
        verse_2 = n["id"]
        link_2  = n["context"]
        if link_1 == link_2 and verse_1 != verse_2:
            utter.append(verse_2)
        
    if len(utter) == 1:
        info = "Verse " + str(utter[0]) + " was NOT uttered together with other verse(s)."
    else:
        utter = sorted(utter)
        info = "Verses " + str(utter) + " were uttered together."
    m["utter"] = info
        
# Write the messages to a JSON file.
with open('../data.json', 'w') as f:
    json.dump(messages, f, indent=4)


                
            
            
                
        
        

            
    
