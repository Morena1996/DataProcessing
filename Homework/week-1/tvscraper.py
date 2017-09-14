#!/usr/bin/env python
# Name: Morena Bastiaansen
# Student number: 10725792
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

url = URL(TARGET_URL)
dom = DOM(url.download(cached=True))

def extract_tvseries(dom, i):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    # extract title
    tvtitle = dom.by_class("lister-item-content")[i].by_tag("a")[0].content

    # extract rating
    rating = dom.by_class("lister-item-content")[i].by_tag("strong")[0].content

    # extract genres and return without \n and white space
    temp_genres = dom.by_class("lister-item-content")[i].by_class("genre")[0].content
    genres = temp_genres[1:].strip()

    # extract actors and return in array
    actors = ""
    count = 0
    for k in dom.by_class("lister-item-content")[i].by_tag("p")[2].by_tag("a"):
        actors = actors + plaintext(k.content)

        # make sure it isn't the last actor and insert comma
        if count < len(dom.by_class("lister-item-content")[i].by_tag("p")[2].by_tag("a")) - 1:
            actors = actors + ","
            count = count + 1 

    # extract runtime and return without "mins"
    runtime_mins = dom.by_class("lister-item-content")[i].by_class("runtime")[0].content
    runtime = runtime_mins.split()[0]

    # return series entries and encode each
    return tvtitle.encode("ascii", "ignore"), rating.encode("ascii", "ignore"), genres.encode("ascii", "ignore"), actors.encode("ascii", "ignore")


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    for i in range(0, len(tvseries)):
        writer.writerow(tvseries[i])

    f.close()

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = []
    count = 0
    for i in dom.by_class("lister-item-content"):
        tvseries.append(extract_tvseries(dom,count))
        count = count + 1

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)


    print tvseries 