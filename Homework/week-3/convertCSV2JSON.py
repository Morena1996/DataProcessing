# Name: Morena Bastiaansen
# Studentnumber: 10725792
#
# convertCSV2JSON.py
# Converts .csv file to .json file

import csv
import json

words = ["date", "temperature"]

def convert(filename):
	filename_csv = filename
	filename_json = file_csv.split(',')[0] + '.json'
	file_csv = open(filename_csv, 'r')
	file_json = open(filename_json, 'w')
	reader = csv.reader(file_csv, words)

	data = []
	for line in file_csv:
		var_1 = line.split(';')[0]
		var_2 = line.split(';')[1].split('\n')[0]
		data.append({words[0]: var_1, words[1]: var_2})


	print data
	json.dump(data, file_json, sort_keys=True, indent=4, seperators=(',', ': '))

	convert("KNMI_2015_DeBilt.csv")





