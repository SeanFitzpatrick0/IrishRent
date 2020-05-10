import os
import time
import json
import itertools
import logging
from pyaxis import pyaxis
import pandas as pd
import numpy as np
from utils import replace_item_in_dict

NAN_REPLACE = 'Missing'
RAW_DATA_PATH = os.path.join(
    'raw_data', 'Quarter_Location_PropertyType_NumbBed(2007Q4-2019Q4)2020_04_22.px')

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')


def clean_data(df):
    # Rename columns
    df.rename(columns={'Number of Bedrooms': 'Beds',
                       'Property Type': 'PropertyType', 'DATA': 'Price'}, inplace=True)

    # Remove invalid characters
    df['Location'] = df['Location'].str.replace('-', ' ')
    df['Location'] = df['Location'].str.replace('.', '')

    # Break up Location
    df['Town'] = df['Location'].map(lambda location: location.split(',')[
                                    0].strip() if len(location.split(',')) > 1 else np.NaN)
    df['County'] = df['Location'].map(lambda location: location.split(',')[
                                      1].strip() if len(location.split(',')) > 1 else location.strip())
    df['County'] = df['County'].str.replace(r' Town| City', '')
    df['PostCode'] = df['County'].map(
        lambda county: county if len(county.split()) > 1 else np.NaN)
    df['County'] = df['County'].map(lambda county: county.split()[
                                    0] if len(county.split()) > 1 else county)
    df = df.drop(columns=['Location'])

    # Create Location Type
    county_rows = df['Town'].isnull() & df['PostCode'].isnull()
    post_code_rows = df['Town'].isnull() & ~county_rows
    town_rows = ~county_rows & ~post_code_rows

    df['LocationType'] = df['County']
    df.loc[county_rows, 'LocationType'] = 'County'
    df.loc[post_code_rows, 'LocationType'] = 'PostCode'
    df.loc[town_rows, 'LocationType'] = 'Town'

    # Mark if the town name appears in multiple counties
    df['InMultipleCounties'] = False
    town_county_combinations = df[town_rows].groupby(
        ['Town', 'County']).groups.keys()
    seen_towns = set()
    for town, _ in town_county_combinations:
        if town not in seen_towns:
            # Mark town as seen
            seen_towns.add(town)
        else:
            # Town appears more than once
            df.loc[df['Town'] == town, 'InMultipleCounties'] = True

    # No entry for just Dublin 22 only 'Swords, Dublin 22'. Create new entry
    dublin22_rows = df[df['PostCode'] == 'Dublin 22'].copy()
    dublin22_rows['Town'] = np.NaN
    dublin22_rows['LocationType'] = 'PostCode'
    df = pd.concat([df, dublin22_rows], ignore_index=True)

    # Fix Beds
    df['Beds'] = df['Beds'].map({
        'All bedrooms': 'Any',
        'One bed': '1',
        'Two bed': '2',
        'Three bed': '3',
        '1 to 2 bed': '1-2',
        '1 to 3 bed': '1-3',
        'Four plus bed': '4+'
    })

    # Fix PropertyType
    df['PropertyType'] = df['PropertyType'].map({
        'All property types': 'Any',
        'Detached house': 'Detached',
        'Semi detached house': 'SemiDetached',
        'Terrace house': 'Terrace',
        'Other flats': 'Flat'
    })

    # Breakup Quarter
    temp = df['Quarter'].str.split('Q', n=1)
    df['Year'], df['Quarter'] = temp.str[0], temp.str[1]

    # Fix Price
    df['Price'] = pd.to_numeric(df['Price'])

    # Unable to groupby NaN values, need to fill Nan https://github.com/pandas-dev/pandas/issues/10468
    df = df.fillna(NAN_REPLACE)

    return df


def format_rent_data(df):
    rent_data = {location_type: {}
                 for location_type in df['LocationType'].unique()}

    for (location_type, county, postcode, town), location_data in df.groupby(['LocationType', 'County', 'PostCode', 'Town']):
        location = {
            'locationType': location_type,
            'county': county,
            'postcode': postcode,
            'town': town
        }

        # Get the prices at each Q for each combination of bed and propertyType
        property_category_prices = {}
        for (property_type, beds), price_data in location_data.groupby(['PropertyType', 'Beds']):
            price_at_times = {f"{row['Year']}Q{row['Quarter']}": row['Price']
                              for _, row in price_data.iterrows()}

            property_type_prices = {
                'propertyType': property_type,
                'beds': beds,
                'prices': price_at_times
            }
            property_category_prices[f'{property_type}_{beds}'] = property_type_prices

        location_key = {'County': county,
                        'PostCode': postcode, 'Town': town}[location_type]
        rent_data[location_type][location_key] = {
            'location': location, 'priceData': property_category_prices}

    # Replace the NaN label
    rent_data = replace_item_in_dict(rent_data, NAN_REPLACE, None)

    return rent_data


def ensure_has_all_locations(rent_data, df):
    # Ensure all valid locations are in the data
    assert len(rent_data['County'].keys()) == len(df['County'].unique())
    valid_postcodes = df['PostCode'].unique().tolist()
    valid_postcodes.remove(NAN_REPLACE)
    assert len(rent_data['PostCode'].keys()) == len(valid_postcodes)
    valid_towns = df['Town'].unique().tolist()
    valid_towns.remove(NAN_REPLACE)
    assert len(rent_data['Town'].keys()) == len(valid_towns)


if __name__ == "__main__":
    # Load data
    px = pyaxis.parse(RAW_DATA_PATH, encoding='ISO-8859-2')
    df = px['DATA']

    # Clean data
    logging.info('Processing rent data ...')
    start_time = time.time()
    df = clean_data(df)
    logging.info(f'--- Finished in {time.time() - start_time :.2f}sec ---')

    # Format data
    logging.info('Formating rent data ...')
    start_time = time.time()
    rent_data = format_rent_data(df)
    logging.info(f'--- Finished in {time.time() - start_time :.2f}sec ---')

    # Vaildate formatted data
    logging.info('Validating formatted rent data ...')
    ensure_has_all_locations(rent_data, df)

    # Write data to JSON
    output_filepath = os.path.join(
        'clean_data', f"rent_data_{time.strftime('%Y-%m-%d-%H-%M-%S')}.json")
    logging.info('Writing data as JSON ...')
    with open(output_filepath, 'w') as fp:
        json.dump(rent_data, fp)

    logging.info(
        f'--- Rent data written to {os.path.abspath(output_filepath)} ---')
