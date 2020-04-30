import os
import time
import json
import itertools
from pyaxis import pyaxis
import pandas as pd
import numpy as np
from utils import replace_item_in_dict


def clean_data(df):
    # Rename columns
    df.rename(columns={'Number of Bedrooms': 'Beds',
                       'Property Type': 'PropertyType', 'DATA': 'Price'}, inplace=True)

    # Break up Location
    # TODO add comments
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

    # Fix Dublin 22 TODO add further doc
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
    # TODO these to tasks are taking a long time, DEEPDIVE
    temp = df['Quarter'].str.split('Q', n=1)
    df['Year'], df['Quarter'] = temp.str[0], temp.str[1]

    # Fix Price
    df['Price'] = pd.to_numeric(df['Price'])

    # https://github.com/pandas-dev/pandas/issues/10468
    # TODO move this to data cleaning
    df = df.fillna('Missing')

    return df


def format_rent_data(df):
    rent_data = {location_type: {}
                 for location_type in df['LocationType'].unique()}

    # TODO test removing inner for by adding all cats to first group by
    for (location_type, county, postcode, town), location_data in df.groupby(['LocationType', 'County', 'PostCode', 'Town']):
        location = {
            'locationType': location_type,
            'county': county,
            'postcode': postcode,
            'town': town
        }

        # TODO doc whats happening
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

    # TODO DOC
    rent_data = replace_item_in_dict(rent_data, 'Missing', None)

    # TODO DOC
    # validate_rent_data(rent_data, df)

    return rent_data


def validate_rent_data(rent_data, df):
    # TODO DOC

    assert len(rent_data['County'].keys()) == len(df['County'].unique())
    valid_postcodes = df['PostCode'].unique().tolist()
    valid_postcodes.remove('Missing')
    assert len(rent_data['PostCode'].keys()) == len(valid_postcodes)
    valid_towns = df['Town'].unique().tolist()
    valid_towns.remove('Missing')
    assert len(rent_data['Town'].keys()) == len(valid_towns)

    merged_records = list(itertools.chain(*[rent_data['County'], rent_data['PostCode'], rent_data['Town']]))
    for record in merged_records:
        import pdb; pdb.set_trace()
        assert 'location' in record
        # TODO validate location info is valid

        # TODO DOC
        assert 'priceData' in record
        assert len(record['priceData']) == (len(df['PropertyType'].unique()) + len(df['Beds'].unique()))



if __name__ == "__main__":
    # TODO add cli
    # TODO break this up into its own main file
    # TODO open file using os path
    # Load data
    px = pyaxis.parse(
        'raw_data/Quarter_Location_PropertyType_NumbBed(2007Q4-2019Q4)2020_04_22.px', encoding='ISO-8859-2')
    df = px['DATA']

    # Clean data
    print('Processing rent data ...')
    start_time = time.time()
    df = clean_data(df)
    # TODO replace with logs
    print(f'--- Finished in {time.time() - start_time :.2f}sec ---')

    # Format data
    print('Formating rent data ...')
    start_time = time.time()
    rent_data = format_rent_data(df)
    print(f'--- Finished in {time.time() - start_time :.2f}sec ---')

    # Write data to JSON
    output_filepath = os.path.join('clean_data', f"rent_data_{time.strftime('%Y-%m-%d-%H-%M-%S')}.json")
    print('Writing data as JSON ...')
    with open(output_filepath, 'w') as fp:
        json.dump(rent_data, fp)

    print(f'--- Rent data written to {os.path.abspath(output_filepath)} ---')
