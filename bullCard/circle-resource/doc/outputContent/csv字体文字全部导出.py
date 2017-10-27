import csv
import sys
import json
import os
reload(sys)
sys.setdefaultencoding( "utf-8" )


def addListStr(tData):
    tData = '[' + tData + ']'
    return tData
def setWords(words):
    try:
        words = int(words)
        words = str(words)
    except:
        if len(words) > 1 and words[0] == '"':
            return words
        words = '"' + words + '"'
    return words

def setSentence(line, isTop):
    words = ""
    chart1 = '"'
    chart2 = ','
    hadChart1 = False
    needD = '';
    for word in line:
        if word != chart1:
            if hadChart1:
                words += word
            else:
                if word != chart2:
                    words += word
                else:
                    words = setWords(words)
                    needD += (words + chart2)
                    words = ""
        else:
            words += chart1
            if hadChart1:
                hadChart1 = False
            else:
                hadChart1 = True
    if words != "":
        if not isTop:
            words = words[:-1]
        words = setWords(words)
        needD += words
        words = ""
    return needD

def parseCSV(data):
    sentence = ""
    lineNum = 0
    needD = ""
    for word in data:
        if word == "\n":
            lineNum += 1
            if lineNum > 3:
                toS = setSentence(sentence, False)
                toS = addListStr(toS)
                needD += (toS + ',\n')
            else:
                sentence = setSentence(sentence[:-1], True)
                sentence = addListStr(sentence)
                needD += (sentence + ',\n')
            sentence = ""
        else:
            sentence += word
    needD = addListStr(needD[:-2] + '\n')
    return needD
	
def getAllContent(dataList):
    contentIndex = 0
    for word in dataList[1]:
        if(word == 'content'):
            break
        else:
            contentIndex += 1
    allContent = ''
    dataIndex = 0
    for data in dataList:
        if dataIndex < 2:
            dataIndex += 1
            continue
        else:
            allContent += data[contentIndex]
    return allContent


def resetName(name):
    name = name.split('.')
    if len(name) < 2:
        return
    if name[1] == 'csv':
        newName = name[0] + '.txt'
        name = name[0] + '.' + name[1]
        data = open(name, 'rb').read().decode('gb2312')
        data = parseCSV(data)
        data = getAllContent(eval(data))
        open('output/'+newName, 'wb').write(data)
def trimfile(dir):
    for fn in os.listdir(dir):
        resetName(fn)


if __name__ == "__main__":
    if not os.path.isdir('output'):
        os.mkdir('output')
    trimfile(os.path.abspath('.'))
