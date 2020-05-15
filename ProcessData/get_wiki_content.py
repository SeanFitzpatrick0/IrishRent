import os
import time
import json
import requests
import logging
import concurrent.futures
import urllib.request
import wikipediaapi
import pandas as pd

# TODO fix logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

# Path to cleaned rent data, (update with the current version of file)
CLEAN_RENT_DATA_PATH = os.path.join(
    'clean_data', 'rent_data_2020-05-12-17-10-38.json')
IMAGE_REQUEST_URL = 'https://en.wikipedia.org/w/api.php?action=query&titles={}&prop=pageimages&format=json&pithumbsize=700'

# Manually annotated town locations and their wiki pages
MISSING_FROM_TOWN_LIST = {
    'Spencer Dock': 'Spencer_Dock', 'Grand Canal Dock': 'Grand_Canal_Dock',
    'Grand Canal Square': 'Grand_Canal_(Ireland)', 'Pearse Street': 'Pearse_Street',
    'Tivoli': 'Tivoli,_Cork', 'Wilton': 'Wilton,_Cork', 'Kinsealy': 'Kinsealy',
    'Mount Merrion': 'Mount_Merrion', 'IFSC': 'International_Financial_Services_Centre',
    'Tara Street': 'Tara_Street', 'Temple Bar': 'Temple_Bar,_Dublin', 'Eastwall': 'East_Wall',
    'Fairview': 'Fairview,_Dublin', 'North Strand': 'North_Strand', 'Pembroke': 'Pembroke_Township',
    'Killester': 'Killester', 'Harolds Cross': "Harold's Cross", 'Arbour Hill': 'Arbour_Hill',
    'North Circular Road': 'North_Circular_Road,_Dublin', 'Phibsborough': 'Phibsborough',
    'Smithfield': 'Smithfield,_Dublin', 'Christchurch': 'Christ Church Cathedral, Dublin',
    'Cork Street': 'Cork_Street,_Dublin', 'Dolphins Barn': "Dolphin's Barn", 'Islandbridge': 'Islandbridge',
    'Parnell Street': 'Parnell_Street', 'Portobello': 'Portobello,_Dublin',
    'South Circular Road': 'South_Circular_Road,_Dublin', 'The Coombe': 'The_Coombe,_Dublin',
    'Beaumont': 'Beaumont,_Dublin', 'Cherry Orchard': 'Cherry_Orchard,_Dublin', 'Kimmage': 'Kimmage',
    'Clongriffin': 'Clongriffin', 'Ashtown': 'Ashtown,_Dublin', 'Porterstown': 'Porterstown_station',
    'Royal Canal Park': 'Royal_Canal', 'Tyrrelstown': 'Tyrrelstown', 'Malahide Road': 'Malahide',
    'Leopardstown': 'Leopardstown', 'Ballycullen': 'Ballycullen', 'Bohermore': 'Bohermore',
    'Doughiska': 'Doughiska', 'Monivea': 'Monivea', 'Roscam': 'Roscam', 'Woodquay': 'Wood_Quay',
    'Carrick On Shannon': 'Carrick-on-Shannon', 'Corbally': 'Corbally', 'Dooradoyle': 'Dooradoyle',
    'Ballisodare': 'Ballysadare', 'Lough Gill': 'Lough_Gill', 'Strandhill': 'Strandhill',
    'Carrick On Suir': 'Carrick-on-Suir', 'Dunmore Road': 'Dunmore_East', 'Ferrybank': 'Ferrybank,_Waterford',
    'Clonard': 'Clonard,_County_Meath', 'Ford': 'Kilmuckridge', 'Delgany': 'Delgany',
    'Old Cratloe Road': 'Cratloe', 'Newmarket On Fergus': 'Newmarket-on-Fergus',
    'Dun Laoghaire': 'Dún Laoghaire', 'Blackrock (Cork)': 'Blackrock,_Cork', 'Clonee (Dublin)': 'Clonee',
    'Blackrock (Dublin)': 'Blackrock,_Dublin', 'Kells (Kilkenny)': 'Kells,_County_Kilkenny',
    'Drogheda (Louth)': 'Drogheda', 'Ballina (Mayo)': 'Ballina,_County_Mayo', 'Clonee (Meath)': 'Clonee',
    'Drogheda (Meath)': 'Drogheda', 'Kells (Meath)': 'Kells,_County_Meath', 'Athlone (Roscommon)': 'Athlone',
    'Ballina (Tipperary)': 'Ballina,_County_Tipperary', 'Athlone (Westmeath)': 'Athlone',
    'Shannon': 'Shannon,_County_Clare', 'Whitegate': 'Whitegate,_County_Cork', 'Churchtown': 'Churchtown,_Dublin',
    'Dundrum': 'Dundrum,_Dublin', 'Marino': 'Marino,_Dublin', 'Irishtown': 'Irishtown,_Dublin',
    'Merrion': 'Merrion,_Dublin', 'Milltown': 'Milltown,_Dublin', 'Monkstown': 'Monkstown,_County_Dublin',
    'Rush': 'Rush,_Dublin', 'Kill': 'Kill,_County_Kildare', 'Newbridge': 'Newbridge,_County_Kildare',
    'Rathangan': 'Rathangan,_County_Kildare', 'Glin': 'Glin,_County_Limerick', 'Raheen': 'Raheen,_County_Limerick',
    'Birr': 'Birr,_County_Offaly', 'Fethard': 'Fethard,_County_Tipperary', 'Rosslare': 'Rosslare_Strand'
}

# Towns with no wiki page or alternative
NO_TOWN_WIKI = set(['Graiguecullen', 'Ballinure', 'Frankfield', 'Aungier Street', 'Charlemont Street',
                    'Hanover Quay', 'Lower Mount Street', 'Townsend Street', 'Navan Road', 'Meakstown',
                    'St Margarets Road', 'Carpenterstown', 'Northern Cross', 'Ballybane', 'Knocknacarra',
                    'Mervue', 'Rahoon', 'Dock Road', 'Ballytivnan', 'Ballytruckle', 'Canada Street', 'Castle Place',
                    'Cork Road', 'Inner Ring Road', 'Johns Hill', 'Mary Street', 'Penrose Lane', 'Poleberry',
                    'Railway Square', 'Scotch Quay', 'Templars Hall', 'Mulgannon', 'Newcastle'])

# Manually annotated images for town with no image or bad image
TOWN_IMG_REPLACEMENTS = {
    'Spencer Dock': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Supporting_France_-_Dublin%2C_Ireland_%2823007980521%29.jpg/640px-Supporting_France_-_Dublin%2C_Ireland_%2823007980521%29.jpg',
    'Balgriffin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Dublin.lennukiaknast.jpg/640px-Dublin.lennukiaknast.jpg',
    'Porterstown': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Blanchardstown_crossroads_2020.jpg/640px-Blanchardstown_crossroads_2020.jpg',
    'Kimmage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/KCR_House.jpg/540px-KCR_House.jpg',
    'Ballycullen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Knocklyon_Shopping_Centre.jpg/640px-Knocklyon_Shopping_Centre.jpg',
    'Beaumont': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Beaumont_Hospital%2C_Dublin_%282020%29.jpg/640px-Beaumont_Hospital%2C_Dublin_%282020%29.jpg',
    'Arbour Hill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Arbour_Hill_Prison.JPG/640px-Arbour_Hill_Prison.JPG',
    'Santry': 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Morton_stadium.jpg',
    'Kinsealy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/HolywellSwords.jpg/640px-HolywellSwords.jpg',
    'South Circular Road': 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Southcircular.jpg',
    'Doughiska': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Galwaycitycollage.jpg/720px-Galwaycitycollage.jpg',
    'Wellpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Galwaycitycollage.jpg/720px-Galwaycitycollage.jpg',
    'Renmore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Galwaycitycollage.jpg/720px-Galwaycitycollage.jpg',
    'Artane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Dancing_Couple_2.jpg/640px-Dancing_Couple_2.jpg',
    'Athboy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/IMG_N51road2888.jpg/640px-IMG_N51road2888.jpg',
    'Baldoyle': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Church_of_St._Laurence_O%27Toole%2C_Baldoyle%2C_Co._Dublin._-_geograph.org.uk_-_627768.jpg',
    'Ballsbridge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/IMG_BallsbridgeVillage2140.jpg/640px-IMG_BallsbridgeVillage2140.jpg',
    'Blackrock (Cork)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Blackrock_Castle_-_panoramio_%287%29.jpg/640px-Blackrock_Castle_-_panoramio_%287%29.jpg',
    'Castlecomer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Castlecomer_in_County_Kilkenny_in_Ireland.jpg/640px-Castlecomer_in_County_Kilkenny_in_Ireland.jpg',
    'Castleisland': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Main_Street%2C_Castleisland%2C_Co._Kerry_-_geograph.org.uk_-_581627.jpg',
    'Castleknock': 'https://upload.wikimedia.org/wikipedia/commons/7/74/Castleknock_Village_-_geograph.org.uk_-_493593.jpg',
    'Castletroy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Shops_at_Annacotty_-_geograph.org.uk_-_2029716.jpg/640px-Shops_at_Annacotty_-_geograph.org.uk_-_2029716.jpg',
    'Citywest': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Citywest-Shopping-Centre_G.jpg',
    'Claregalway': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Claregalway_friary_01.jpg/640px-Claregalway_friary_01.jpg',
    'Clonee (Dublin)': 'https://upload.wikimedia.org/wikipedia/commons/1/13/Clonee_Village_-_geograph.org.uk_-_665044.jpg',
    'Clonee (Meath)': 'https://upload.wikimedia.org/wikipedia/commons/1/13/Clonee_Village_-_geograph.org.uk_-_665044.jpg',
    'Clonskeagh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Clonskeagh_Green.jpg/640px-Clonskeagh_Green.jpg',
    'Donaghmede': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Donaghmedechurch.jpg',
    'Dooradoyle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/O%27Connell_Monument_to_Daniel_O%27Connell_at_O%27Connell_Avenue%2C_Limerick_City.jpg/640px-O%27Connell_Monument_to_Daniel_O%27Connell_at_O%27Connell_Avenue%2C_Limerick_City.jpg',
    'Douglas': 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Grange_Road_-_geograph.org.uk_-_760164.jpg',
    'Dundrum': 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Dundrum_Shopping_Centre_-_geograph.org.uk_-_1551710.jpg',
    'Dungarvan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Dungarvan_ireland_harbour.JPG/640px-Dungarvan_ireland_harbour.JPG',
    'Finglas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Col%C3%A1iste_%C3%8Dde_College_of_Further_Education_%282019%29.jpg/640px-Col%C3%A1iste_%C3%8Dde_College_of_Further_Education_%282019%29.jpg',
    'Islandbridge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/IslandBridge-full.JPG/640px-IslandBridge-full.JPG',
    'Irishtown': 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Ringsend_Power_Station_i.jpg',
    'Kilcullen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Kilcullen_Card2of4.jpg/620px-Kilcullen_Card2of4.jpg',
    'Killaloe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Killaloe%2C_County_Clare_with_the_Shannon_in_the_foreground.jpg/640px-Killaloe%2C_County_Clare_with_the_Shannon_in_the_foreground.jpg',
    'Lucan': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Lucan_Shopping_Centre_-_geograph.org.uk_-_553631.jpg',
    'Marino': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Casino_marino.JPG/640px-Casino_marino.JPG',
    'Monkstown': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Monkstown_Dublin.JPG/640px-Monkstown_Dublin.JPG',
    'Montenotte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Montenotte%2C_Cork%2C_Ireland_-_panoramio_%283%29.jpg/640px-Montenotte%2C_Cork%2C_Ireland_-_panoramio_%283%29.jpg',
    'Mount Merrion': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Church_of_St._Therese%2C_Mount_Merrion.JPG/640px-Church_of_St._Therese%2C_Mount_Merrion.JPG',
    'North Circular Road': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Gill%27s_pub%2C_Dublin.jpg/640px-Gill%27s_pub%2C_Dublin.jpg',
    'Old Cratloe Road': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Cliffs_of_Moher%2C_Ireland_%288577753321%29.jpg/640px-Cliffs_of_Moher%2C_Ireland_%288577753321%29.jpg',
    'Oranmore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Oranmore_Castle.jpg/640px-Oranmore_Castle.jpg',
    'Palmerstown': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Palmerstown_Village.JPG/640px-Palmerstown_Village.JPG',
    'Portumna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Portumna_castle.jpg/640px-Portumna_castle.jpg',
    'Raheny': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Raheny_railway_station.jpg/640px-Raheny_railway_station.jpg',
    'Ranelagh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Ranelagh_triangle.jpg/640px-Ranelagh_triangle.jpg',
    'Rathfarnham': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Rathfarnham_Castle.jpg/640px-Rathfarnham_Castle.jpg',
    'Rochestown': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Rochestown_Friary_and_College_-_geograph.org.uk_-_1426548.jpg',
    'Salthill': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Salthill_and_Galway_Bay%2C_Galway_%28506275%29_%2826131600653%29.jpg/640px-Salthill_and_Galway_Bay%2C_Galway_%28506275%29_%2826131600653%29.jpg',
    'Sandymount': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/IMG_SandymountBaths.jpg/640px-IMG_SandymountBaths.jpg',
    'Templeogue': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Shops_at_Fortfield_Park_in_Templeogue.jpg/640px-Shops_at_Fortfield_Park_in_Templeogue.jpg',
    'Terenure': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Terenure_College%2C_Dublin.jpg/640px-Terenure_College%2C_Dublin.jpg',
    'Wilton': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Cork_City_Montage_Quick_Collage_of_CC_Commons_Cork_Images.jpg',
    'Baldoyle': 'https://upload.wikimedia.org/wikipedia/commons/7/73/The_View_from_Strand_Road_Baldoyle_-_geograph.org.uk_-_181928.jpg',
    'Cabra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Cabra_Luas_station_%282019%29.jpg/640px-Cabra_Luas_station_%282019%29.jpg',
    'Christchurch': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Christ_Church_Cathedral%2C_Dublin%2C_2016-06-03.jpg/556px-Christ_Church_Cathedral%2C_Dublin%2C_2016-06-03.jpg',
    'Coolmine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Coolmine_woods.jpg/640px-Coolmine_woods.jpg',
    'Glenageary': 'https://upload.wikimedia.org/wikipedia/commons/9/92/Glenageary5.jpg',
    'Glin': 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Glin_Castle.jpg',
    'Harolds Cross': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mt-jerome-entrance.jpg/640px-Mt-jerome-entrance.jpg',
    'Rush': 'https://en.wikipedia.org/wiki/Rush,_Dublin#/media/File:Rush_beach.jpg',
    'Tivolia': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Cork_City_Montage_Quick_Collage_of_CC_Commons_Cork_Images.jpg'
}

# Manually annotated images for counties with bad images
COUNTY_IMG_REPLACEMENTS = {
    'Cork': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Cork_City_Montage_Quick_Collage_of_CC_Commons_Cork_Images.jpg',
    'Galway': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Galwaycitycollage.jpg/768px-Galwaycitycollage.jpg',
    'Kerry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Dingle_North_West_%28stevefe%29_2.jpg/640px-Dingle_North_West_%28stevefe%29_2.jpg',
    'Clare': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Cliffs_of_Moher%2C_Ireland_%288577753321%29.jpg/640px-Cliffs_of_Moher%2C_Ireland_%288577753321%29.jpg',
    'Limerick': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Limerickcitycollage3.jpg/768px-Limerickcitycollage3.jpg',
    'Wexford': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Main_Street_Wexford_-_geograph.org.uk_-_316261.jpg',
    'Kilkenny': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Kilkenny_castle_3.jpg/640px-Kilkenny_castle_3.jpg',
    'Waterford': 'https://upload.wikimedia.org/wikipedia/commons/b/be/Waterford_collage2.jpg',
    'Longford': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Longford_St._Mel%27s_Cathedral_II_2019_08_23.jpg/720px-Longford_St._Mel%27s_Cathedral_II_2019_08_23.jpg',
    'Dublin': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/DublinMontage.jpg'
}


def get_location_summary_and_thumbnail(name, page, replacement_images):
    """ Get the Wiki summary and images for a page """
    # Get location summary
    summary = page.summary

    # Get location image
    img_name = None
    wiki_page_title = os.path.basename(page.fullurl)
    img_source = None

    try:
        if name in replacement_images:
            img_source = replacement_images[name]
        else:
            responce = requests.get(IMAGE_REQUEST_URL.format(wiki_page_title))
            img_page = responce.json()['query']['pages'].popitem()[1]
            img_source = img_page['thumbnail']['source']

        img_extention = os.path.splitext(img_source)[1]
        img_name = f'{name}{img_extention}'
        # Download image from url
        urllib.request.urlretrieve(img_source, os.path.join(
            'clean_data', 'location_images', img_name))
    except Exception as e:
        logging.error(f'Unable to get location image for {name}. \n{e}')
        img_name = None

    return name, summary, img_name


def get_location_pages(list_page, locations_data, not_in_list={}, no_location_page=set()):
    """ Get the Wiki page for each each location """
    # Get all links on page
    list_links = list_page.links

    # Find page for each location
    location_pages = {}
    for location_name, location_data in locations_data.items():
        # Get link(s) which include the location name
        location_links = [link_text for link_text in list_links.keys()
                          if location_name in link_text]

        # One link match found
        if len(location_links) == 1:
            location_pages[location_name] = list_links[location_links[0]]
        # Exact location name in multiple location links
        elif location_name in location_links:
            location_pages[location_name] = list_links[location_name]
        # Get location page not in page list
        elif location_name in not_in_list:
            location_pages[location_name] = wiki.page(
                not_in_list[location_name])
        # No town Wiki page, get county page
        elif location_name in no_location_page:
            county = location_data['location']['county']
            location_pages[location_name] = wiki.page(f'County_{county}')
        else:
            logging.error(f'Unable to handel getting page for {location_name}')

    return location_pages


def get_locations_content(location_pages, replacement_images):
    """ Get Wiki content from location pages """
    locations_content = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        # Get location details asynchronously
        future_location_details = (executor.submit(get_location_summary_and_thumbnail, name, page, replacement_images)
                                   for name, page in location_pages.items())

        # Join all threads
        for future in concurrent.futures.as_completed(future_location_details):
            try:
                name, summary, img_name = future.result()
                locations_content[name] = {
                    'summary': summary, 'image': img_name}
            except Exception as e:
                logging.error(f'Unable to get contnet \n{e}')

    return locations_content


def get_postcode_content(postcodes, postcode_image):
    """ Get Wiki content for postcodes """
    wiki = wikipediaapi.Wikipedia('en')
    postcode_page = wiki.page('List_of_Dublin_postal_districts')
    description_section = postcode_page.section_by_title('Structure')
    lines = description_section.text.split('\n')
    # get the start of get description list (+2 skips this line and the empty lin break after)
    start_of_descriptions = lines.index(
        'The districts, and the main areas and streets they contain, include:') + 2
    lines = lines[start_of_descriptions:]

    # Get description for each postcode
    postcodes = set(postcodes)
    postcode_content = {}
    for line in lines:
        postcode = ' '.join(line.split()[:2])  # first 2 words in line
        if postcode in postcodes:
            postcode_content[postcode] = {
                'summary': line, 'image': postcode_image}
        else:
            logging.error(f'No postcode with name {postcode} found.')

    return postcode_content


if __name__ == "__main__":
    logging.info('--- Starting ---')

    # Load cleaned rent data JSON
    rent_data = None
    with open(CLEAN_RENT_DATA_PATH) as fp:
        rent_data = json.load(fp)

    # Get wikipedia location lists
    wiki = wikipediaapi.Wikipedia('en')
    towns_list_page = wiki.page(
        'List_of_towns_and_villages_in_the_Republic_of_Ireland')
    counties_list_page = wiki.page('List_of_Irish_counties_by_area')

    # Get pages for locations
    counties_pages = get_location_pages(
        counties_list_page, rent_data['County'])
    town_pages = get_location_pages(
        towns_list_page, rent_data['Town'], MISSING_FROM_TOWN_LIST, NO_TOWN_WIKI)

    # Get Wiki Content
    logging.info('Getting Wiki content ...')
    start_time = time.time()

    logging.info('(getting Counties content - asynchronously)')
    counties_content = get_locations_content(
        counties_pages, COUNTY_IMG_REPLACEMENTS)

    logging.info('(getting Town content - asynchronously)')
    towns_content = get_locations_content(town_pages, TOWN_IMG_REPLACEMENTS)

    logging.info('(getting postcode content)')
    postcodes = rent_data['PostCode'].keys()
    dublin_img = counties_content['Dublin']['image']
    postcode_content = get_postcode_content(postcodes, dublin_img)

    wiki_data = {
        'County': counties_content,
        'PostCode': postcode_content,
        'Town': towns_content
    }
    logging.info(f'--- Finished in {time.time() - start_time :.2f}sec ---')
    number_of_locations = len(counties_content) + \
        len(towns_content) + len(postcode_content)
    logging.info(f'(Retrieved content for {number_of_locations} locations)')

    # Write data to JSON
    output_filepath = os.path.join(
        'clean_data', f"wiki_data_{time.strftime('%Y-%m-%d-%H-%M-%S')}.json")
    logging.info('Writing wiki data as JSON ...')
    with open(output_filepath, 'w') as fp:
        json.dump(wiki_data, fp)

    logging.info(
        f'--- Wiki data written to {os.path.abspath(output_filepath)} ---')

    logging.info('--- Finished ---')
