# Name: Morena Bastiaansen
# Studentnumber: 10725792
#
# convertCSV2JSON.py
# Converts .csv file to .json file

import csv
import json

words = ["country", "life_expectancy", "unemployment", "pmtct", "continent"]

def convert(filename):
	filename_csv = filename
	filename_json = filename_csv.split('.')[0] + '.json'
	file_csv = open(filename_csv, 'r')
	file_json = open(filename_json, 'w')
	reader = csv.reader(file_csv, words)

	data = []
	for line in file_csv:
		var_0 = line.split(';')[0]
		var_1 = line.split(';')[1]
		var_2 = line.split(';')[2]
		var_3 = line.split(';')[3]
		var_4 = line.split(';')[4].split('\n')[0]

		data.append({words[0]: var_0, words[1]: var_1, words[2]: var_2, words[3]: var_3, words[4]: var_4})


	json.dump(data, file_json, sort_keys=True, indent=4, separators=(',', ': '))

	
convert("data1.csv")







