var PROJECT_SYSTEM_SETTINGS = {
    "LOCAL_API_SERVER_DOMAIN_LIST": ['localhost'],
    "LOCAL_API_SERVER_ADDRESS_LIST": ['http://localhost:8073/'],
    // "LOCAL_API_SERVER_ADDRESS_LIST": ['https://staging.vindm.nu:8073/', 'https://18.184.32.140:8073/'],
    "STAGING_API_SERVER_DOMAIN_LIST": ['staging.vindm.nu', '18.184.32.140'],
    "STAGING_API_SERVER_ADDRESS_LIST": ['https://staging.vindm.nu:8073/', 'https://18.184.32.140:8073/'],
    "PRODUCTION_API_SERVER_DOMAIN_LIST": ['app.vindm.nu', 'vindm.nu', '35.157.157.32'],
    "PRODUCTION_API_SERVER_ADDRESS_LIST": ['https://app.vindm.nu:8073/', 'https://vindm.nu:8073/', 'https://35.157.157.32:8073/'],
    "SEARCH_QUERY_FILTER_OPERATOR": '__icontains',
    "SEARCH_QUERY_KEY": 'search_query',
    "PAGE_SIZE_LIST": [10, 25, 50],
    "DEFAULT_PAGE_SIZE": 10,
    "DATEPICKER_DATE_TIME_FORMAT": 'DD-MM-YYYY h:mm',
    "REVERSE_DATEPICKER_DATE_TIME_FORMAT": 'MM-DD-YYYY h:mm',
    "SYSTEM_LANGUAGE" : "nl"
}

export default PROJECT_SYSTEM_SETTINGS;
