interface ICountryData {
    id: number;
    name: string;
    alpha2: string;
    alpha3: string;
    code: number;
    phoneCode:number;
    additionalPhoneCodes?:number[];
    dateFormat?:string
    currency:{
        name: string;
        code: string;
        decimals: number;
    }
}




export class CountriesData {
    
    static countries: ICountryData[] = [
        {id: 1, name: 'Afghanistan', alpha2: 'AF', alpha3: 'AFG',dateFormat:"DD/MM/YYYY", code: 4, phoneCode: 93, currency: { name: 'Afghan Afghani', code: 'AFN', decimals: 2 } },
        {id: 2, name: 'Albania', alpha2: 'AL', alpha3: 'ALB',dateFormat:"DD.MM.YYYY", code: 8, phoneCode: 355, currency: { name: 'Albanian Lek', code: 'ALL', decimals: 2 } },
        {id: 3, name: 'Algeria', alpha2: 'DZ', alpha3: 'DZA',dateFormat:"DD-MM-YYYY", code: 12, phoneCode: 213, currency: { name: 'Algerian Dinar', code: 'DZD', decimals: 2 } },
        {id: 4, name: 'American Samoa', alpha2: 'AS', alpha3: 'ASM',dateFormat:"MM/DD/YYYY", code: 16, phoneCode: 1684, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 5, name: 'Andorra', alpha2: 'AD', alpha3: 'AND',dateFormat:"DD/MM/YYYY", code: 20, phoneCode: 376, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 6, name: 'Angola', alpha2: 'AO', alpha3: 'AGO',dateFormat:"DD/MM/YYYY", code: 24, phoneCode: 244, currency: { name: 'Angolan Kwanza', code: 'AOA', decimals: 2 } },
        {id: 7, name: 'Anguilla', alpha2: 'AI', alpha3: 'AIA',dateFormat:"MM/DD/YYYY", code: 660, phoneCode: 1264, currency: { name: 'East Caribbean Dollar', code: 'XCD', decimals: 2 } },
        {id: 8, name: 'Antigua and Barbuda', alpha2: 'AG', alpha3: 'ATG',dateFormat:"MM/DD/YYYY", code: 28, phoneCode: 1268, currency: { name: 'East Caribbean Dollar', code: 'XCD', decimals: 2 } },
        {id: 9, name: 'Argentina', alpha2: 'AR', alpha3: 'ARG',dateFormat:"DD/MM/YYYY", code: 32, phoneCode: 54, currency: { name: 'Argentine Peso', code: 'ARS', decimals: 2 } },
        {id: 10, name: 'Armenia', alpha2: 'AM', alpha3: 'ARM',dateFormat:"DD.MM.YYYY", code: 51, phoneCode: 374, currency: { name: 'Armenian Dram', code: 'AMD', decimals: 2 } },
        {id: 11, name: 'Aruba', alpha2: 'AW', alpha3: 'ABW',dateFormat:"", code: 0, phoneCode: 297, currency: { name: 'Aruban Florin', code: 'AWG', decimals: 2 } },
        {id: 12, name: 'Australia', alpha2: 'AU', alpha3: 'AUS',dateFormat:"DD/MM/YYYY", code: 36, phoneCode: 61, currency: { name: 'Australian Dollar', code: 'AUD', decimals: 2 } },
        {id: 13, name: 'Austria', alpha2: 'AT', alpha3: 'AUT',dateFormat:"DD.MM.YYYY", code: 40, phoneCode: 43, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 14, name: 'Azerbaijan', alpha2: 'AZ', alpha3: 'AZE',dateFormat:"DD.MM.YYYY", code: 31, phoneCode: 994, currency: { name: 'Azerbaijani Manat', code: 'AZN', decimals: 2 } },
        {id: 15, name: 'Bahamas', alpha2: 'BS', alpha3: 'BHS',dateFormat:"MM/DD/YYYY", code: 44, phoneCode: 1242, currency: { name: 'Bahamian Dollar', code: 'BSD', decimals: 2 } },
        {id: 16, name: 'Bahrain', alpha2: 'BH', alpha3: 'BHR',dateFormat:"DD/MM/YYYY", code: 48, phoneCode: 973, currency: { name: 'Bahraini Dinar', code: 'BHD', decimals: 3 } },
        {id: 17, name: 'Bangladesh', alpha2: 'BD', alpha3: 'BGD',dateFormat:"DD-MM-YYYY", code: 50, phoneCode: 880, currency: { name: 'Bangladeshi Taka', code: 'BDT', decimals: 2 } },
        {id: 18, name: 'Barbados', alpha2: 'BB', alpha3: 'BRB',dateFormat:"DD/MM/YYYY", code: 52, phoneCode: 1246, currency: { name: 'Barbadian Dollar', code: 'BBD', decimals: 2 } },
        {id: 19, name: 'Belarus', alpha2: 'BY', alpha3: 'BLR',dateFormat:"DD.MM.YYYY", code: 112, phoneCode: 375, currency: { name: 'Belarusian Ruble', code: 'BYN', decimals: 2 } },
        {id: 20, name: 'Belgium', alpha2: 'BE', alpha3: 'BEL',dateFormat:"DD/MM/YYYY", code: 56, phoneCode: 32, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 21, name: 'Belize', alpha2: 'BZ', alpha3: 'BLZ',dateFormat:"DD/MM/YYYY", code: 84, phoneCode: 501, currency: { name: 'Belize Dollar', code: 'BZD', decimals: 2 } },
        {id: 22, name: 'Benin', alpha2: 'BJ', alpha3: 'BEN',dateFormat:"DD/MM/YYYY", code: 204, phoneCode: 229, currency: { name: 'West African CFA Franc', code: 'XOF', decimals: 2 } },
        {id: 23, name: 'Bermuda', alpha2: 'BM', alpha3: 'BMU',dateFormat:"MM/DD/YYYY", code: 60, phoneCode: 1441, currency: { name: 'Bermudian Dollar', code: 'BMD', decimals: 2 } },
        {id: 24, name: 'Bhutan', alpha2: 'BT', alpha3: 'BTN',dateFormat:"DD/MM/YYYY", code: 64, phoneCode: 975, currency: { name: 'Bhutanese Ngultrum', code: 'BTN', decimals: 2 } },
        {id: 25, name: 'Bolivia', alpha2: 'BO', alpha3: 'BOL',dateFormat:"DD/MM/YYYY", code: 68, phoneCode: 591, currency: { name: 'Bolivian Boliviano', code: 'BOB', decimals: 2 } },
        {id: 26, name: 'Bosnia and Herzegovina', alpha2: 'BA', alpha3: 'BIH',dateFormat:"DD.MM.YYYY", code: 70, phoneCode: 387, currency: { name: 'Convertible Mark', code: 'BAM', decimals: 2 } },
        {id: 27, name: 'Botswana', alpha2: 'BW', alpha3: 'BWA',dateFormat:"DD/MM/YYYY", code: 72, phoneCode: 267, currency: { name: 'Botswana Pula', code: 'BWP', decimals: 2 } },
        {id: 28, name: 'Brazil', alpha2: 'BR', alpha3: 'BRA',dateFormat:"DD/MM/YYYY", code: 76, phoneCode: 55, currency: { name: 'Brazilian Real', code: 'BRL', decimals: 2 } },
        {id: 29, name: 'British Indian Ocean Territory', alpha2: 'IO', alpha3: 'IOT',dateFormat:"", code: 0, phoneCode: 246, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 30, name: 'British Virgin Islands', alpha2: 'VG', alpha3: 'VGB',dateFormat:"", code: 0, phoneCode: 1284, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 31, name: 'Brunei', alpha2: 'BN', alpha3: 'BRN',dateFormat:"DD/MM/YYYY", code: 96, phoneCode: 673, currency: { name: 'Brunei Dollar', code: 'BND', decimals: 2 } },
        {id: 32, name: 'Bulgaria', alpha2: 'BG', alpha3: 'BGR',dateFormat:"DD.MM.YYYY", code: 100, phoneCode: 359, currency: { name: 'Bulgarian Lev', code: 'BGN', decimals: 2 } },
        {id: 33, name: 'Burkina Faso', alpha2: 'BF', alpha3: 'BFA',dateFormat:"DD/MM/YYYY", code: 854, phoneCode: 226, currency: { name: 'West African CFA Franc', code: 'XOF', decimals: 2 } },
        {id: 34, name: 'Burma (Myanmar)', alpha2: 'MM', alpha3: 'MMR',dateFormat:"DD/MM/YYYY", code: 104, phoneCode: 95, currency: { name: 'Myanmar Kyat', code: 'MMK', decimals: 2 } },
        {id: 35, name: 'Burundi', alpha2: 'BI', alpha3: 'BDI',dateFormat:"DD/MM/YYYY", code: 108, phoneCode: 257, currency: { name: 'Burundian Franc', code: 'BIF', decimals: 0 } },
        {id: 36, name: 'Cambodia', alpha2: 'KH', alpha3: 'KHM',dateFormat:"DD/MM/YYYY", code: 116, phoneCode: 855, currency: { name: 'Cambodian Riel', code: 'KHR', decimals: 2 } },
        {id: 37, name: 'Cameroon', alpha2: 'CM', alpha3: 'CMR',dateFormat:"DD/MM/YYYY", code: 120, phoneCode: 237, currency: { name: 'Central African CFA Franc', code: 'XAF', decimals: 2 } },
        {id: 38, name: 'Canada', alpha2: 'CA', alpha3: 'CAN',dateFormat:"YYYY-MM-DD", code: 124, phoneCode: 1, currency: { name: 'Canadian Dollar', code: 'CAD', decimals: 2 } },
        {id: 39, name: 'Cape Verde', alpha2: 'CV', alpha3: 'CPV',dateFormat:"DD/MM/YYYY", code: 132, phoneCode: 238, currency: { name: 'Cape Verdean Escudo', code: 'CVE', decimals: 2 } },
        {id: 40, name: 'Cayman Islands', alpha2: 'KY', alpha3: 'CYM',dateFormat:"MM/DD/YYYY", code: 136, phoneCode: 1345, currency: { name: 'Cayman Islands Dollar', code: 'KYD', decimals: 2 } },
        {id: 41, name: 'Central African Republic', alpha2: 'CF', alpha3: 'CAF',dateFormat:"DD/MM/YYYY", code: 140, phoneCode: 236, currency: { name: 'Central African CFA Franc', code: 'XAF', decimals: 2 } },
        {id: 42, name: 'Chad', alpha2: 'TD', alpha3: 'TCD',dateFormat:"DD/MM/YYYY", code: 148, phoneCode: 235, currency: { name: 'Central African CFA Franc', code: 'XAF', decimals: 2 } },
        {id: 43, name: 'Chile', alpha2: 'CL', alpha3: 'CHL',dateFormat:"DD-MM-YYYY", code: 152, phoneCode: 56, currency: { name: 'Chilean Peso', code: 'CLP', decimals: 0 } },
        {id: 44, name: 'China', alpha2: 'CN', alpha3: 'CHN',dateFormat:"YYYY-MM-DD", code: 156, phoneCode: 86, currency: { name: 'Chinese Yuan', code: 'CNY', decimals: 2 } },
        {id: 45, name: 'Christmas Island', alpha2: 'CX', alpha3: 'CXR',dateFormat:"", code: 0, phoneCode: 61, currency: { name: 'Australian Dollar', code: 'AUD', decimals: 2 } },
        {id: 46, name: 'Cocos (Keeling) Islands', alpha2: 'CC', alpha3: 'CCK',dateFormat:"", code: 0, phoneCode: 61, currency: { name: 'Australian Dollar', code: 'AUD', decimals: 2 } },
        {id: 47, name: 'Colombia', alpha2: 'CO', alpha3: 'COL',dateFormat:"DD/MM/YYYY", code: 170, phoneCode: 57, currency: { name: 'Colombian Peso', code: 'COP', decimals: 2 } },
        {id: 48, name: 'Comoros', alpha2: 'KM', alpha3: 'COM',dateFormat:"DD/MM/YYYY", code: 174, phoneCode: 269, currency: { name: 'Comorian Franc', code: 'KMF', decimals: 0 } },
        {id: 49, name: 'Cook Islands', alpha2: 'CK', alpha3: 'COK',dateFormat:"", code: 0, phoneCode: 682, currency: { name: 'New Zealand Dollar', code: 'NZD', decimals: 2 } },
        {id: 50, name: 'Costa Rica', alpha2: 'CR', alpha3: 'CRC',dateFormat:"DD/MM/YYYY", code: 188, phoneCode: 506, currency: { name: 'Costa Rican Colón', code: 'CRC', decimals: 2 } },
        {id: 51, name: 'Croatia', alpha2: 'HR', alpha3: 'HRV',dateFormat:"DD.MM.YYYY", code: 191, phoneCode: 385, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 52, name: 'Cuba', alpha2: 'CU', alpha3: 'CUB',dateFormat:"DD/MM/YYYY", code: 192, phoneCode: 53, currency: { name: 'Cuban Peso', code: 'CUP', decimals: 2 } },
        {id: 53, name: 'Curaçao', alpha2: 'CW', alpha3: 'CUW',dateFormat:"", code: 0, phoneCode: 599, currency: { name: 'Netherlands Antillean Guilder', code: 'ANG', decimals: 2 } },
        {id: 54, name: 'Cyprus', alpha2: 'CY', alpha3: 'CYP',dateFormat:"DD/MM/YYYY", code: 196, phoneCode: 357, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 55, name: 'Czech Republic', alpha2: 'CZ', alpha3: 'CZE',dateFormat:"DD.MM.YYYY", code: 203, phoneCode: 420, currency: { name: 'Czech Koruna', code: 'CZK', decimals: 2 } },
        {id: 56, name: 'Democratic Republic of the Congo', alpha2: 'CD', alpha3: 'COD',dateFormat:"DD/MM/YYYY", code: 180, phoneCode: 243, currency: { name: 'Congolese Franc', code: 'CDF', decimals: 2 } },
        {id: 57, name: 'Denmark', alpha2: 'DK', alpha3: 'DNK',dateFormat:"DD-MM-YYYY", code: 208, phoneCode: 45, currency: { name: 'Danish Krone', code: 'DKK', decimals: 2 } },
        {id: 58, name: 'Djibouti', alpha2: 'DJ', alpha3: 'DJI',dateFormat:"DD/MM/YYYY", code: 262, phoneCode: 253, currency: { name: 'Djiboutian Franc', code: 'DJF', decimals: 0 } },
        {id: 59, name: 'Dominica', alpha2: 'DM', alpha3: 'DMA',dateFormat:"DD/MM/YYYY", code: 212, phoneCode: 1767, currency: { name: 'East Caribbean Dollar', code: 'XCD', decimals: 2 } },
        {id: 60, name: 'Dominican Republic', alpha2: 'DO', alpha3: 'DOM',dateFormat:"DD/MM/YYYY", code: 214, phoneCode: 1809, additionalPhoneCodes:[1829,1849], currency: { name: 'Dominican Peso', code: 'DOP', decimals: 2 } },
        {id: 61, name: 'Ecuador', alpha2: 'EC', alpha3: 'ECU',dateFormat:"DD/MM/YYYY", code: 218, phoneCode: 593, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 62, name: 'Egypt', alpha2: 'EG', alpha3: 'EGY',dateFormat:"DD/MM/YYYY", code: 818, phoneCode: 20, currency: { name: 'Egyptian Pound', code: 'EGP', decimals: 2 } },
        {id: 63, name: 'El Salvador', alpha2: 'SV', alpha3: 'SLV',dateFormat:"DD/MM/YYYY", code: 222, phoneCode: 503, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 64, name: 'Equatorial Guinea', alpha2: 'GQ', alpha3: 'GNQ',dateFormat:"DD/MM/YYYY", code: 226, phoneCode: 240, currency: { name: 'Central African CFA Franc', code: 'XAF', decimals: 2 } },
        {id: 65, name: 'Eritrea', alpha2: 'ER', alpha3: 'ERI',dateFormat:"DD/MM/YYYY", code: 232, phoneCode: 291, currency: { name: 'Eritrean Nakfa', code: 'ERN', decimals: 2 } },
        {id: 66, name: 'Estonia', alpha2: 'EE', alpha3: 'EST',dateFormat:"DD.MM.YYYY", code: 233, phoneCode: 372, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 67, name: 'Eswatini', alpha2: 'SZ', alpha3: 'SWZ',dateFormat:"", code: 0, phoneCode: 268, currency: { name: 'Swazi Lilangeni', code: 'SZL', decimals: 2 } },
        {id: 68, name: 'Ethiopia', alpha2: 'ET', alpha3: 'ETH',dateFormat:"DD/MM/YYYY", code: 231, phoneCode: 251, currency: { name: 'Ethiopian Birr', code: 'ETB', decimals: 2 } },
        {id: 69, name: 'Falkland Islands', alpha2: 'FK', alpha3: 'FLK',dateFormat:"", code: 0, phoneCode: 500, currency: { name: 'Falkland Islands Pound', code: 'FKP', decimals: 2 } },
        {id: 70, name: 'Faroe Islands', alpha2: 'FO', alpha3: 'FRO',dateFormat:"", code: 0, phoneCode: 298, currency: { name: 'Danish Krone', code: 'DKK', decimals: 2 } },
        {id: 71, name: 'Fiji', alpha2: 'FJ', alpha3: 'FJI',dateFormat:"", code: 242, phoneCode: 679, currency: { name: 'Fijian Dollar', code: 'FJD', decimals: 2 } },
        {id: 72, name: 'Finland', alpha2: 'FI', alpha3: 'FIN',dateFormat:"DD.MM.YYYY", code: 246, phoneCode: 358, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 73, name: 'France', alpha2: 'FR', alpha3: 'FRA',dateFormat:"DD/MM/YYYY", code: 250, phoneCode: 33, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 74, name: 'French Polynesia', alpha2: 'PF', alpha3: 'PYF',dateFormat:"", code: 0, phoneCode: 689, currency: { name: 'CFP Franc', code: 'XPF', decimals: 0 } },
        {id: 75, name: 'French Guiana', alpha2: 'GF', alpha3: 'GFA',dateFormat:"", code: 0, phoneCode: 594, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 76, name: 'Gabon', alpha2: 'GA', alpha3: 'GAB',dateFormat:"", code: 266, phoneCode: 241, currency: { name: 'Central African CFA Franc', code: 'XAF', decimals: 2 } },
        {id: 77, name: 'Gambia', alpha2: 'GM', alpha3: 'GMB',dateFormat:"", code: 270, phoneCode: 220, currency: { name: 'Gambian Dalasi', code: 'GMD', decimals: 2 } },
        {id: 78, name: 'Georgia', alpha2: 'GE', alpha3: 'GEO',dateFormat:"DD/MM/YYYY", code: 268, phoneCode: 995, currency: { name: 'Georgian Lari', code: 'GEL', decimals: 2 } },
        {id: 79, name: 'Germany', alpha2: 'DE', alpha3: 'DEU',dateFormat:"DD.MM.YYYY", code: 276, phoneCode: 49, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 80, name: 'Ghana', alpha2: 'GH', alpha3: 'GHA',dateFormat:"", code: 288, phoneCode: 233, currency: { name: 'Ghanaian Cedi', code: 'GHS', decimals: 2 } },
        {id: 81, name: 'Gibraltar', alpha2: 'GI', alpha3: 'GIB',dateFormat:"", code: 0, phoneCode: 350, currency: { name: 'Gibraltar Pound', code: 'GIP', decimals: 2 } },
        {id: 82, name: 'Greece', alpha2: 'GR', alpha3: 'GRC',dateFormat:"DD/MM/YYYY", code: 300, phoneCode: 30, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 83, name: 'Greenland', alpha2: 'GL', alpha3: 'GRL',dateFormat:"", code: 0, phoneCode: 299, currency: { name: 'Danish Krone', code: 'DKK', decimals: 2 } },
        {id: 84, name: 'Grenada', alpha2: 'GD', alpha3: 'GRD',dateFormat:"", code: 0, phoneCode: 1473, currency: { name: 'East Caribbean Dollar', code: 'XCD', decimals: 2 } },
        {id: 85, name: 'Guadeloupe', alpha2: 'GP', alpha3: 'GLP',dateFormat:"", code: 0, phoneCode: 590, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 86, name: 'Guam', alpha2: 'GU', alpha3: 'GUM',dateFormat:"", code: 0, phoneCode: 1671, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 87, name: 'Guatemala', alpha2: 'GT', alpha3: 'GTM',dateFormat:"", code: 320, phoneCode: 502, currency: { name: 'Guatemalan Quetzal', code: 'GTQ', decimals: 2 } },
        {id: 88, name: 'Guinea', alpha2: 'GN', alpha3: 'GIN',dateFormat:"", code: 324, phoneCode: 224, currency: { name: 'Guinean Franc', code: 'GNF', decimals: 0 } },
        {id: 89, name: 'Guinea-Bissau', alpha2: 'GW', alpha3: 'GNB',dateFormat:"", code: 624, phoneCode: 245, currency: { name: 'West African CFA Franc', code: 'XOF', decimals: 2 } },
        {id: 90, name: 'Guyana', alpha2: 'GY', alpha3: 'GUY',dateFormat:"", code: 328, phoneCode: 592, currency: { name: 'Guyanese Dollar', code: 'GYD', decimals: 2 } },
        {id: 91, name: 'Haiti', alpha2: 'HT', alpha3: 'HTI',dateFormat:"", code: 332, phoneCode: 509, currency: { name: 'Haitian Gourde', code: 'HTG', decimals: 2 } },
        {id: 92, name: 'Holy See (Vatican City)', alpha2: 'VA', alpha3: 'VAT',dateFormat:"", code: 0, phoneCode: 379, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 93, name: 'Honduras', alpha2: 'HN', alpha3: 'HND',dateFormat:"", code: 340, phoneCode: 504, currency: { name: 'Honduran Lempira', code: 'HNL', decimals: 2 } },
        {id: 94, name: 'Hong Kong', alpha2: 'HK', alpha3: 'HKG',dateFormat:"DD/MM/YYYY", code: 0, phoneCode: 852, currency: { name: 'Hong Kong Dollar', code: 'HKD', decimals: 2 } },
        {id: 95, name: 'Hungary', alpha2: 'HU', alpha3: 'HUN',dateFormat:"YYYY.MM.DD", code: 348, phoneCode: 36, currency: { name: 'Hungarian Forint', code: 'HUF', decimals: 2 } },
        {id: 96, name: 'Iceland', alpha2: 'IS', alpha3: 'ISL',dateFormat:"DD.MM.YYYY", code: 352, phoneCode: 354, currency: { name: 'Icelandic Króna', code: 'ISK', decimals: 0 } },
        {id: 97, name: 'India', alpha2: 'IN', alpha3: 'IND',dateFormat:"DD-MM-YYYY", code: 356, phoneCode: 91, currency: { name: 'Indian Rupee', code: 'INR', decimals: 2 } },
        {id: 98, name: 'Indonesia', alpha2: 'ID', alpha3: 'IDN',dateFormat:"DD/MM/YYYY", code: 360, phoneCode: 62, currency: { name: 'Indonesian Rupiah', code: 'IDR', decimals: 2 } },
        {id: 99, name: 'Iran', alpha2: 'IR', alpha3: 'IRN',dateFormat:"YYYY/MM/DD", code: 364, phoneCode: 98, currency: { name: 'Iranian Rial', code: 'IRR', decimals: 2 } },
        {id: 100, name: 'Iraq', alpha2: 'IQ', alpha3: 'IRQ',dateFormat:"DD/MM/YYYY", code: 368, phoneCode: 964, currency: { name: 'Iraqi Dinar', code: 'IQD', decimals: 3 } },
        {id: 101, name: 'Ireland', alpha2: 'IE', alpha3: 'IRL',dateFormat:"DD/MM/YYYY", code: 372, phoneCode: 353, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 102, name: 'Isle of Man', alpha2: 'IM', alpha3: 'IMN',dateFormat:"", code: 0, phoneCode: 44, currency: { name: 'Manx Pound', code: 'GBP', decimals: 2 } },
        {id: 103, name: 'Israel', alpha2: 'IL', alpha3: 'ISR',dateFormat:"DD/MM/YYYY", code: 376, phoneCode: 972, currency: { name: 'Israeli New Shekel', code: 'ILS', decimals: 2 } },
        {id: 104, name: 'Italy', alpha2: 'IT', alpha3: 'ITA',dateFormat:"DD/MM/YYYY", code: 380, phoneCode: 39, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 105, name: 'Jamaica', alpha2: 'JM', alpha3: 'JAM',dateFormat:"DD/MM/YYYY", code: 388, phoneCode: 1876, currency: { name: 'Jamaican Dollar', code: 'JMD', decimals: 2 } },
        {id: 106, name: 'Japan', alpha2: 'JP', alpha3: 'JPN',dateFormat:"YYYY/MM/DD", code: 392, phoneCode: 81, currency: { name: 'Japanese Yen', code: 'JPY', decimals: 0 } },
        {id: 107, name: 'Jordan', alpha2: 'JO', alpha3: 'JOR',dateFormat:"DD/MM/YYYY", code: 400, phoneCode: 962, currency: { name: 'Jordanian Dinar', code: 'JOD', decimals: 3 } },
        {id: 108, name: 'Kazakhstan', alpha2: 'KZ', alpha3: 'KAZ',dateFormat:"DD.MM.YYYY", code: 398, phoneCode: 7, currency: { name: 'Kazakhstani Tenge', code: 'KZT', decimals: 2 } },
        {id: 109, name: 'Kenya', alpha2: 'KE', alpha3: 'KEN',dateFormat:"DD/MM/YYYY", code: 404, phoneCode: 254, currency: { name: 'Kenyan Shilling', code: 'KES', decimals: 2 } },
        {id: 110, name: 'Kiribati', alpha2: 'KI', alpha3: 'KIR',dateFormat:"DD/MM/YYYY", code: 296, phoneCode: 686, currency: { name: 'Australian Dollar', code: 'AUD', decimals: 2 } },
        {id: 111, name: 'Kosovo', alpha2: 'XK', alpha3: 'XKX',dateFormat:"", code: 0, phoneCode: 383, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 112, name: 'Kuwait', alpha2: 'KW', alpha3: 'KWT',dateFormat:"DD/MM/YYYY", code: 414, phoneCode: 965, currency: { name: 'Kuwaiti Dinar', code: 'KWD', decimals: 3 } },
        {id: 113, name: 'Kyrgyzstan', alpha2: 'KG', alpha3: 'KGZ',dateFormat:"DD.MM.YYYY", code: 417, phoneCode: 996, currency: { name: 'Kyrgyzstani Som', code: 'KGS', decimals: 2 } },
        {id: 114, name: 'Laos', alpha2: 'LA', alpha3: 'LAO',dateFormat:"DD/MM/YYYY", code: 418, phoneCode: 856, currency: { name: 'Lao Kip', code: 'LAK', decimals: 2 } },
        {id: 115, name: 'Latvia', alpha2: 'LV', alpha3: 'LVA',dateFormat:"DD.MM.YYYY", code: 428, phoneCode: 371, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 116, name: 'Lebanon', alpha2: 'LB', alpha3: 'LBN',dateFormat:"DD/MM/YYYY", code: 422, phoneCode: 961, currency: { name: 'Lebanese Pound', code: 'LBP', decimals: 2 } },
        {id: 117, name: 'Lesotho', alpha2: 'LS', alpha3: 'LSO',dateFormat:"DD/MM/YYYY", code: 426, phoneCode: 266, currency: { name: 'Lesotho Loti', code: 'LSL', decimals: 2 } },
        {id: 118, name: 'Liberia', alpha2: 'LR', alpha3: 'LBR',dateFormat:"DD/MM/YYYY", code: 430, phoneCode: 231, currency: { name: 'Liberian Dollar', code: 'LRD', decimals: 2 } },
        {id: 119, name: 'Libya', alpha2: 'LY', alpha3: 'LBY',dateFormat:"DD/MM/YYYY", code: 434, phoneCode: 218, currency: { name: 'Libyan Dinar', code: 'LYD', decimals: 3 } },
        {id: 120, name: 'Liechtenstein', alpha2: 'LI', alpha3: 'LIE',dateFormat:"DD.MM.YYYY", code: 438, phoneCode: 423, currency: { name: 'Swiss Franc', code: 'CHF', decimals: 2 } },
        {id: 121, name: 'Lithuania', alpha2: 'LT', alpha3: 'LTU',dateFormat:"YYYY-MM-DD", code: 440, phoneCode: 370, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 122, name: 'Luxembourg', alpha2: 'LU', alpha3: 'LUX',dateFormat:"DD.MM.YYYY", code: 442, phoneCode: 352, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 123, name: 'Macau', alpha2: 'MO', alpha3: 'MAC',dateFormat:"", code: 0, phoneCode: 853, currency: { name: 'Macanese Pataca', code: 'MOP', decimals: 2 } },
        {id: 124, name: 'Madagascar', alpha2: 'MG', alpha3: 'MDG',dateFormat:"DD/MM/YYYY", code: 450, phoneCode: 261, currency: { name: 'Malagasy Ariary', code: 'MGA', decimals: 2 } },
        {id: 125, name: 'Malawi', alpha2: 'MW', alpha3: 'MWI',dateFormat:"DD/MM/YYYY", code: 454, phoneCode: 265, currency: { name: 'Malawian Kwacha', code: 'MWK', decimals: 2 } },
        {id: 126, name: 'Malaysia', alpha2: 'MY', alpha3: 'MYS',dateFormat:"DD/MM/YYYY", code: 458, phoneCode: 60, currency: { name: 'Malaysian Ringgit', code: 'MYR', decimals: 2 } },
        {id: 127, name: 'Maldives', alpha2: 'MV', alpha3: 'MDV',dateFormat:"DD/MM/YYYY", code: 462, phoneCode: 960, currency: { name: 'Maldivian Rufiyaa', code: 'MVR', decimals: 2 } },
        {id: 128, name: 'Mali', alpha2: 'ML', alpha3: 'MLI',dateFormat:"DD/MM/YYYY", code: 466, phoneCode: 223, currency: { name: 'West African CFA Franc', code: 'XOF', decimals: 2 } },
        {id: 129, name: 'Malta', alpha2: 'MT', alpha3: 'MLT',dateFormat:"DD/MM/YYYY", code: 470, phoneCode: 356, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 130, name: 'Marshall Islands', alpha2: 'MH', alpha3: 'MHL',dateFormat:"MM/DD/YYYY", code: 584, phoneCode: 692, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 131, name: 'Martinique', alpha2: 'MQ', alpha3: 'MTQ',dateFormat:"", code: 0, phoneCode: 596, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 132, name: 'Mauritania', alpha2: 'MR', alpha3: 'MRT',dateFormat:"DD/MM/YYYY", code: 478, phoneCode: 222, currency: { name: 'Mauritanian Ouguiya', code: 'MRU', decimals: 2 } },
        {id: 133, name: 'Mauritius', alpha2: 'MU', alpha3: 'MUS',dateFormat:"DD/MM/YYYY", code: 480, phoneCode: 230, currency: { name: 'Mauritian Rupee', code: 'MUR', decimals: 2 } },
        {id: 134, name: 'Mayotte', alpha2: 'YT', alpha3: 'MYT',dateFormat:"", code: 0, phoneCode: 262, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 135, name: 'Mexico', alpha2: 'MX', alpha3: 'MEX',dateFormat:"DD/MM/YYYY", code: 484, phoneCode: 52, currency: { name: 'Mexican Peso', code: 'MXN', decimals: 2 } },
        {id: 136, name: 'Micronesia', alpha2: 'FM', alpha3: 'FSM',dateFormat:"MM/DD/YYYY", code: 583, phoneCode: 691, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 137, name: 'Moldova', alpha2: 'MD', alpha3: 'MDA',dateFormat:"DD.MM.YYYY", code: 498, phoneCode: 373, currency: { name: 'Moldovan Leu', code: 'MDL', decimals: 2 } },
        {id: 138, name: 'Monaco', alpha2: 'MC', alpha3: 'MCO',dateFormat:"DD/MM/YYYY", code: 492, phoneCode: 377, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 139, name: 'Mongolia', alpha2: 'MN', alpha3: 'MNG',dateFormat:"YYYY.MM.DD", code: 496, phoneCode: 976, currency: { name: 'Mongolian Tögrög', code: 'MNT', decimals: 2 } },
        {id: 140, name: 'Montenegro', alpha2: 'ME', alpha3: 'MNE',dateFormat:"DD.MM.YYYY", code: 499, phoneCode: 382, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 141, name: 'Montserrat', alpha2: 'MS', alpha3: 'MSR',dateFormat:"", code: 0, phoneCode: 1664, currency: { name: 'East Caribbean Dollar', code: 'XCD', decimals: 2 } },
        {id: 142, name: 'Morocco', alpha2: 'MA', alpha3: 'MAR',dateFormat:"DD/MM/YYYY", code: 504, phoneCode: 212, currency: { name: 'Moroccan Dirham', code: 'MAD', decimals: 2 } },
        {id: 143, name: 'Mozambique', alpha2: 'MZ', alpha3: 'MOZ',dateFormat:"DD/MM/YYYY", code: 508, phoneCode: 258, currency: { name: 'Mozambican Metical', code: 'MZN', decimals: 2 } },
        {id: 144, name: 'Curaçao', alpha2: 'CW', alpha3: 'CUW',dateFormat:"", code: 0, phoneCode: 599, currency: { name: 'Netherlands Antillean Guilder', code: 'ANG', decimals: 2 } },
        {id: 145, name: 'Sint Maarten', alpha2: 'SX', alpha3: 'SXM',dateFormat:"", code: 0, phoneCode: 599, currency: { name: 'Netherlands Antillean Guilder', code: 'ANG', decimals: 2 } },
        {id: 146, name: 'Bonaire, Sint Eustatius and Saba', alpha2: 'BQ', alpha3: 'BES',dateFormat:"", code: 0, phoneCode: 599, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 147, name: 'Namibia', alpha2: 'NA', alpha3: 'NAM',dateFormat:"DD/MM/YYYY", code: 516, phoneCode: 264, currency: { name: 'Namibian Dollar', code: 'NAD', decimals: 2 } },
        {id: 148, name: 'Nauru', alpha2: 'NR', alpha3: 'NRU',dateFormat:"DD/MM/YYYY", code: 520, phoneCode: 674, currency: { name: 'Australian Dollar', code: 'AUD', decimals: 2 } },
        {id: 149, name: 'Nepal', alpha2: 'NP', alpha3: 'NPL',dateFormat:"DD/MM/YYYY", code: 524, phoneCode: 977, currency: { name: 'Nepalese Rupee', code: 'NPR', decimals: 2 } },
        {id: 150, name: 'Netherlands', alpha2: 'NL', alpha3: 'NLD',dateFormat:"DD-MM-YYYY", code: 528, phoneCode: 31, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 151, name: 'New Caledonia', alpha2: 'NC', alpha3: 'NCL',dateFormat:"", code: 0, phoneCode: 687, currency: { name: 'CFP Franc', code: 'XPF', decimals: 0 } },
        {id: 152, name: 'New Zealand', alpha2: 'NZ', alpha3: 'NZL',dateFormat:"DD/MM/YYYY", code: 554, phoneCode: 64, currency: { name: 'New Zealand Dollar', code: 'NZD', decimals: 2 } },
        {id: 153, name: 'Nicaragua', alpha2: 'NI', alpha3: 'NIC',dateFormat:"DD/MM/YYYY", code: 558, phoneCode: 505, currency: { name: 'Nicaraguan Córdoba', code: 'NIO', decimals: 2 } },
        {id: 154, name: 'Niger', alpha2: 'NE', alpha3: 'NER',dateFormat:"DD/MM/YYYY", code: 562, phoneCode: 227, currency: { name: 'West African CFA Franc', code: 'XOF', decimals: 2 } },
        {id: 155, name: 'Nigeria', alpha2: 'NG', alpha3: 'NGA',dateFormat:"DD/MM/YYYY", code: 566, phoneCode: 234, currency: { name: 'Nigerian Naira', code: 'NGN', decimals: 2 } },
        {id: 156, name: 'Niue', alpha2: 'NU', alpha3: 'NIU',dateFormat:"", code: 0, phoneCode: 683, currency: { name: 'New Zealand Dollar', code: 'NZD', decimals: 2 } },
        {id: 157, name: 'Norfolk Island', alpha2: 'NF', alpha3: 'NFK',dateFormat:"", code: 0, phoneCode: 672, currency: { name: 'Australian Dollar', code: 'AUD', decimals: 2 } },
        {id: 158, name: 'North Korea', alpha2: 'KP', alpha3: 'PRK',dateFormat:"YYYY.MM.DD", code: 408, phoneCode: 850, currency: { name: 'North Korean Won', code: 'KPW', decimals: 2 } },
        {id: 159, name: 'North Macedonia', alpha2: 'MK', alpha3: 'MKD',dateFormat:"", code: 0, phoneCode: 389, currency: { name: 'Macedonian Denar', code: 'MKD', decimals: 2 } },
        {id: 160, name: 'Northern Mariana Islands', alpha2: 'MP', alpha3: 'MNP',dateFormat:"", code: 0, phoneCode: 1670, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 161, name: 'Norway', alpha2: 'NO', alpha3: 'NOR',dateFormat:"DD.MM.YYYY", code: 578, phoneCode: 47, currency: { name: 'Norwegian Krone', code: 'NOK', decimals: 2 } },
        {id: 162, name: 'Oman', alpha2: 'OM', alpha3: 'OMN',dateFormat:"DD/MM/YYYY", code: 512, phoneCode: 968, currency: { name: 'Omani Rial', code: 'OMR', decimals: 3 } },
        {id: 163, name: 'Pakistan', alpha2: 'PK', alpha3: 'PAK',dateFormat:"DD/MM/YYYY", code: 586, phoneCode: 92, currency: { name: 'Pakistani Rupee', code: 'PKR', decimals: 2 } },
        {id: 164, name: 'Palau', alpha2: 'PW', alpha3: 'PLW',dateFormat:"MM/DD/YYYY", code: 585, phoneCode: 680, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 165, name: 'Palestine', alpha2: 'PS', alpha3: 'PSE',dateFormat:"DD/MM/YYYY", code: 275, phoneCode: 970, currency: { name: 'Israeli New Shekel', code: 'ILS', decimals: 2 } },
        {id: 166, name: 'Panama', alpha2: 'PA', alpha3: 'PAN',dateFormat:"DD/MM/YYYY", code: 591, phoneCode: 507, currency: { name: 'Balboa', code: 'PAB', decimals: 2 } },
        {id: 167, name: 'Papua New Guinea', alpha2: 'PG', alpha3: 'PNG',dateFormat:"DD/MM/YYYY", code: 598, phoneCode: 675, currency: { name: 'Papua New Guinean Kina', code: 'PGK', decimals: 2 } },
        {id: 168, name: 'Paraguay', alpha2: 'PY', alpha3: 'PRY',dateFormat:"DD/MM/YYYY", code: 600, phoneCode: 595, currency: { name: 'Paraguayan Guaraní', code: 'PYG', decimals: 0 } },
        {id: 169, name: 'Peru', alpha2: 'PE', alpha3: 'PER',dateFormat:"DD/MM/YYYY", code: 604, phoneCode: 51, currency: { name: 'Peruvian Sol', code: 'PEN', decimals: 2 } },
        {id: 170, name: 'Philippines', alpha2: 'PH', alpha3: 'PHL',dateFormat:"MM/DD/YYYY", code: 608, phoneCode: 63, currency: { name: 'Philippine Peso', code: 'PHP', decimals: 2 } },
        {id: 171, name: 'Pitcairn Islands', alpha2: 'PN', alpha3: 'PCN',dateFormat:"", code: 0, phoneCode: 64, currency: { name: 'New Zealand Dollar', code: 'NZD', decimals: 2 } },
        {id: 172, name: 'Poland', alpha2: 'PL', alpha3: 'POL',dateFormat:"DD.MM.YYYY", code: 616, phoneCode: 48, currency: { name: 'Polish Złoty', code: 'PLN', decimals: 2 } },
        {id: 173, name: 'Portugal', alpha2: 'PT', alpha3: 'PRT',dateFormat:"DD/MM/YYYY", code: 620, phoneCode: 351, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 174, name: 'Puerto Rico', alpha2: 'PR', alpha3: 'PRI',dateFormat:"", code: 0, phoneCode: 1, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 175, name: 'Qatar', alpha2: 'QA', alpha3: 'QAT',dateFormat:"DD/MM/YYYY", code: 634, phoneCode: 974, currency: { name: 'Qatari Riyal', code: 'QAR', decimals: 2 } },
        {id: 176, name: 'Republic of the Congo', alpha2: 'CG', alpha3: 'COG',dateFormat:"DD/MM/YYYY", code: 178, phoneCode: 242, currency: { name: 'Central African CFA Franc', code: 'XAF', decimals: 2 } },
        {id: 177, name: 'Romania', alpha2: 'RO', alpha3: 'ROU',dateFormat:"DD.MM.YYYY", code: 642, phoneCode: 40, currency: { name: 'Romanian Leu', code: 'RON', decimals: 2 } },
        {id: 178, name: 'Russia', alpha2: 'RU', alpha3: 'RUS',dateFormat:"DD.MM.YYYY", code: 643, phoneCode: 7, currency: { name: 'Russian Ruble', code: 'RUB', decimals: 2 } },
        {id: 179, name: 'Rwanda', alpha2: 'RW', alpha3: 'RWA',dateFormat:"DD/MM/YYYY", code: 646, phoneCode: 250, currency: { name: 'Rwandan Franc', code: 'RWF', decimals: 0 } },
        {id: 180, name: 'Reunion island', alpha2: 'RE', alpha3: 'REU',dateFormat:"", code: 0, phoneCode: 262, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 181, name: 'Saint Martin', alpha2: 'MF', alpha3: 'MAF',dateFormat:"", code: 0, phoneCode: 590, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 182, name: 'Saint Pierre and Miquelon', alpha2: 'PM', alpha3: 'SPM',dateFormat:"", code: 0, phoneCode: 508, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 183, name: 'Saint Barthelemy', alpha2: 'BL', alpha3: 'BLM',dateFormat:"", code: 0, phoneCode: 590, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 184, name: 'Saint Helena', alpha2: 'SH', alpha3: 'SHN',dateFormat:"", code: 0, phoneCode: 290, currency: { name: 'Saint Helena Pound', code: 'SHP', decimals: 2 } },
        {id: 185, name: 'Saint Kitts and Nevis', alpha2: 'KN', alpha3: 'KNA',dateFormat:"", code: 0, phoneCode: 1869, currency: { name: 'East Caribbean Dollar', code: 'XCD', decimals: 2 } },
        {id: 186, name: 'Saint Lucia', alpha2: 'LC', alpha3: 'LCA',dateFormat:"", code: 0, phoneCode: 1758, currency: { name: 'East Caribbean Dollar', code: 'XCD', decimals: 2 } },
        {id: 187, name: 'Saint Vincent and the Grenadines', alpha2: 'VC', alpha3: 'VCT',dateFormat:"", code: 0, phoneCode: 1784, currency: { name: 'East Caribbean Dollar', code: 'XCD', decimals: 2 } },
        {id: 188, name: 'Samoa', alpha2: 'WS', alpha3: 'WSM',dateFormat:"DD/MM/YYYY", code: 882, phoneCode: 685, currency: { name: 'Samoan Tālā', code: 'WST', decimals: 2 } },
        {id: 189, name: 'San Marino', alpha2: 'SM', alpha3: 'SMR',dateFormat:"DD/MM/YYYY", code: 674, phoneCode: 378, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 190, name: 'Saudi Arabia', alpha2: 'SA', alpha3: 'SAU',dateFormat:"DD/MM/YYYY", code: 682, phoneCode: 966, currency: { name: 'Saudi Riyal', code: 'SAR', decimals: 2 } },
        {id: 191, name: 'Senegal', alpha2: 'SN', alpha3: 'SEN',dateFormat:"DD/MM/YYYY", code: 686, phoneCode: 221, currency: { name: 'West African CFA Franc', code: 'XOF', decimals: 2 } },
        {id: 192, name: 'Serbia', alpha2: 'RS', alpha3: 'SRB',dateFormat:"DD.MM.YYYY", code: 688, phoneCode: 381, currency: { name: 'Serbian Dinar', code: 'RSD', decimals: 2 } },
        {id: 193, name: 'Seychelles', alpha2: 'SC', alpha3: 'SYC',dateFormat:"DD/MM/YYYY", code: 690, phoneCode: 248, currency: { name: 'Seychellois Rupee', code: 'SCR', decimals: 2 } },
        {id: 194, name: 'Sierra Leone', alpha2: 'SL', alpha3: 'SLE',dateFormat:"DD/MM/YYYY", code: 694, phoneCode: 232, currency: { name: 'Sierra Leonean Leone', code: 'SLL', decimals: 2 } },
        {id: 195, name: 'Singapore', alpha2: 'SG', alpha3: 'SGP',dateFormat:"DD/MM/YYYY", code: 702, phoneCode: 65, currency: { name: 'Singapore Dollar', code: 'SGD', decimals: 2 } },
        {id: 196, name: 'Slovakia', alpha2: 'SK', alpha3: 'SVK',dateFormat:"DD.MM.YYYY", code: 703, phoneCode: 421, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 197, name: 'Slovenia', alpha2: 'SI', alpha3: 'SVN',dateFormat:"DD.MM.YYYY", code: 705, phoneCode: 386, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 198, name: 'Solomon Islands', alpha2: 'SB', alpha3: 'SLB',dateFormat:"DD/MM/YYYY", code: 90, phoneCode: 677, currency: { name: 'Solomon Islands Dollar', code: 'SBD', decimals: 2 } },
        {id: 199, name: 'Somalia', alpha2: 'SO', alpha3: 'SOM',dateFormat:"DD/MM/YYYY", code: 706, phoneCode: 252, currency: { name: 'Somali Shilling', code: 'SOS', decimals: 2 } },
        {id: 200, name: 'South Africa', alpha2: 'ZA', alpha3: 'ZAF',dateFormat:"YYYY/MM/DD", code: 710, phoneCode: 27, currency: { name: 'South African Rand', code: 'ZAR', decimals: 2 } },
        {id: 201, name: 'South Korea', alpha2: 'KR', alpha3: 'KOR',dateFormat:"YYYY.MM.DD", code: 410, phoneCode: 82, currency: { name: 'South Korean Won', code: 'KRW', decimals: 0 } },
        {id: 202, name: 'Spain', alpha2: 'ES', alpha3: 'ESP',dateFormat:"DD/MM/YYYY", code: 724, phoneCode: 34, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 203, name: 'Sri Lanka', alpha2: 'LK', alpha3: 'LKA',dateFormat:"DD/MM/YYYY", code: 144, phoneCode: 94, currency: { name: 'Sri Lankan Rupee', code: 'LKR', decimals: 2 } },
        {id: 204, name: 'Sudan', alpha2: 'SD', alpha3: 'SDN',dateFormat:"DD/MM/YYYY", code: 729, phoneCode: 249, currency: { name: 'Sudanese Pound', code: 'SDG', decimals: 2 } },
        {id: 205, name: 'Suriname', alpha2: 'SR', alpha3: 'SUR',dateFormat:"DD/MM/YYYY", code: 740, phoneCode: 597, currency: { name: 'Surinamese Dollar', code: 'SRD', decimals: 2 } },
        {id: 206, name: 'Sweden', alpha2: 'SE', alpha3: 'SWE',dateFormat:"YYYY-MM-DD", code: 752, phoneCode: 46, currency: { name: 'Swedish Krona', code: 'SEK', decimals: 2 } },
        {id: 207, name: 'Switzerland', alpha2: 'CH', alpha3: 'CHE',dateFormat:"DD.MM.YYYY", code: 756, phoneCode: 41, currency: { name: 'Swiss Franc', code: 'CHF', decimals: 2 } },
        {id: 208, name: 'Syria', alpha2: 'SY', alpha3: 'SYR',dateFormat:"DD/MM/YYYY", code: 760, phoneCode: 963, currency: { name: 'Syrian Pound', code: 'SYP', decimals: 2 } },
        {id: 209, name: 'Taiwan', alpha2: 'TW', alpha3: 'TWN',dateFormat:"YYYY/MM/DD", code: 158, phoneCode: 886, currency: { name: 'New Taiwan Dollar', code: 'TWD', decimals: 2 } },
        {id: 210, name: 'Tajikistan', alpha2: 'TJ', alpha3: 'TJK',dateFormat:"DD.MM.YYYY", code: 762, phoneCode: 992, currency: { name: 'Tajikistani Somoni', code: 'TJS', decimals: 2 } },
        {id: 211, name: 'Tanzania', alpha2: 'TZ', alpha3: 'TZA',dateFormat:"DD/MM/YYYY", code: 834, phoneCode: 255, currency: { name: 'Tanzanian Shilling', code: 'TZS', decimals: 2 } },
        {id: 212, name: 'Thailand', alpha2: 'TH', alpha3: 'THA',dateFormat:"DD/MM/YYYY", code: 764, phoneCode: 66, currency: { name: 'Thai Baht', code: 'THB', decimals: 2 } },
        {id: 213, name: 'Timor-Leste', alpha2: 'TL', alpha3: 'TLS',dateFormat:"YYYY-MM-DD", code: 626, phoneCode: 670, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 214, name: 'Togo', alpha2: 'TG', alpha3: 'TGO',dateFormat:"DD/MM/YYYY", code: 768, phoneCode: 228, currency: { name: 'West African CFA Franc', code: 'XOF', decimals: 2 } },
        {id: 215, name: 'Tokelau', alpha2: 'TK', alpha3: 'TKL',dateFormat:"", code: 0, phoneCode: 690, currency: { name: 'New Zealand Dollar', code: 'NZD', decimals: 2 } },
        {id: 216, name: 'Tonga', alpha2: 'TO', alpha3: 'TON',dateFormat:"DD/MM/YYYY", code: 776, phoneCode: 676, currency: { name: 'Tongan Paʻanga', code: 'TOP', decimals: 2 } },
        {id: 217, name: 'Trinidad and Tobago', alpha2: 'TT', alpha3: 'TTO',dateFormat:"MM/DD/YYYY", code: 780, phoneCode: 1868, currency: { name: 'Trinidad and Tobago Dollar', code: 'TTD', decimals: 2 } },
        {id: 218, name: 'Tunisia', alpha2: 'TN', alpha3: 'TUN',dateFormat:"DD/MM/YYYY", code: 788, phoneCode: 216, currency: { name: 'Tunisian Dinar', code: 'TND', decimals: 3 } },
        {id: 219, name: 'Turkey', alpha2: 'TR', alpha3: 'TUR',dateFormat:"DD.MM.YYYY", code: 792, phoneCode: 90, currency: { name: 'Turkish Lira', code: 'TRY', decimals: 2 } },
        {id: 220, name: 'Turkmenistan', alpha2: 'TM', alpha3: 'TKM',dateFormat:"DD.MM.YYYY", code: 795, phoneCode: 993, currency: { name: 'Turkmenistani Manat', code: 'TMT', decimals: 2 } },
        {id: 221, name: 'Tuvalu', alpha2: 'TV', alpha3: 'TUV',dateFormat:"DD/MM/YYYY", code: 798, phoneCode: 688, currency: { name: 'Australian Dollar', code: 'AUD', decimals: 2 } },
        {id: 222, name: 'Uganda', alpha2: 'UG', alpha3: 'UGA',dateFormat:"DD/MM/YYYY", code: 800, phoneCode: 256, currency: { name: 'Ugandan Shilling', code: 'UGX', decimals: 0 } },
        {id: 223, name: 'Ukraine', alpha2: 'UA', alpha3: 'UKR',dateFormat:"DD.MM.YYYY", code: 804, phoneCode: 380, currency: { name: 'Ukrainian Hryvnia', code: 'UAH', decimals: 2 } },
        {id: 224, name: 'United Arab Emirates', alpha2: 'AE', alpha3: 'ARE',dateFormat:"DD/MM/YYYY", code: 784, phoneCode: 971, currency: { name: 'UAE Dirham', code: 'AED', decimals: 2 } },
        {id: 225, name: 'United Kingdom', alpha2: 'GB', alpha3: 'GBR',dateFormat:"DD/MM/YYYY", code: 826, phoneCode: 44, currency: { name: 'British Pound Sterling', code: 'GBP', decimals: 2 } },
        {id: 226, name: 'United States', alpha2: 'US', alpha3: 'USA',dateFormat:"MM/DD/YYYY", code: 840, phoneCode: 1, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 227, name: 'Uruguay', alpha2: 'UY', alpha3: 'URY',dateFormat:"DD/MM/YYYY", code: 858, phoneCode: 598, currency: { name: 'Uruguayan Peso', code: 'UYU', decimals: 2 } },
        {id: 228, name: 'Uzbekistan', alpha2: 'UZ', alpha3: 'UZB',dateFormat:"DD.MM.YYYY", code: 860, phoneCode: 998, currency: { name: 'Uzbekistani Soʻm', code: 'UZS', decimals: 2 } },
        {id: 229, name: 'US Virgin Islands', alpha2: 'VI', alpha3: 'VIR',dateFormat:"", code: 0, phoneCode: 1340, currency: { name: 'US Dollar', code: 'USD', decimals: 2 } },
        {id: 230, name: 'Vanuatu', alpha2: 'VU', alpha3: 'VUT',dateFormat:"DD/MM/YYYY", code: 548, phoneCode: 678, currency: { name: 'Vanuatu Vatu', code: 'VUV', decimals: 0 } },
        {id: 231, name: 'Vatican City', alpha2: 'VA', alpha3: 'VAT',dateFormat:"", code: 0, phoneCode: 379, currency: { name: 'Euro', code: 'EUR', decimals: 2 } },
        {id: 232, name: 'Venezuela', alpha2: 'VE', alpha3: 'VEN',dateFormat:"DD/MM/YYYY", code: 862, phoneCode: 58, currency: { name: 'Venezuelan Bolívar', code: 'VES', decimals: 2 } },
        {id: 233, name: 'Vietnam', alpha2: 'VN', alpha3: 'VNM',dateFormat:"DD/MM/YYYY", code: 704, phoneCode: 84, currency: { name: 'Vietnamese Đồng', code: 'VND', decimals: 0 } },
        {id: 234, name: 'Wallis and Futuna', alpha2: 'WF', alpha3: 'WLF',dateFormat:"", code: 0, phoneCode: 681, currency: { name: 'CFP Franc', code: 'XPF', decimals: 0 } },
        {id: 235, name: 'Western Sahara', alpha2: 'EH', alpha3: 'ESH',dateFormat:"", code: 0, phoneCode: 212, currency: { name: 'Moroccan Dirham', code: 'MAD', decimals: 2 } },
        {id: 236, name: 'Yemen', alpha2: 'YE', alpha3: 'YEM',dateFormat:"DD/MM/YYYY", code: 887, phoneCode: 967, currency: { name: 'Yemeni Rial', code: 'YER', decimals: 2 } },
        {id: 237, name: 'Zambia', alpha2: 'ZM', alpha3: 'ZMB',dateFormat:"DD/MM/YYYY", code: 894, phoneCode: 260, currency: { name: 'Zambian Kwacha', code: 'ZMW', decimals: 2 } },
        {id: 238, name: 'Zimbabwe', alpha2: 'ZW', alpha3: 'ZWE',dateFormat:"DD/MM/YYYY", code: 716, phoneCode: 263, currency: { name: 'Zimbabwean Dollar', code: 'ZWL', decimals: 2 } }
    ];

    private static wasSortedFor: string | null = null;
    static getNormalizedCountries(lang: string): ICountryData[] {
        // TODO: translate country using localization

        if (this.wasSortedFor !== lang) {
            this.countries.sort((a, b) => {
                if (a.name > b.name) return 1;
                if (b.name > a.name) return -1;
                return 0;
            });
        }

        return this.countries;
    }

    static getCountryByAlpha2(alpha2: string): ICountryData | null {
        alpha2 = alpha2.toUpperCase();
        return this.countries.find((val) => val.alpha2 === alpha2) ?? null;
    }

    static normilizePhone(value?: string): string {
        if (value) {
            const country = this.getCountryByPhoneNumber(value);
            if (country) {
                return '+' + country.phoneCode + ' ' + value.substring(value.indexOf(country.phoneCode.toString()) + country.phoneCode.toString().length);
            } else {
                return value;
            }
        }
        return ';';
    }

    /**
     *  Get country by phone
     *  @param phoneNumber - string, phone number
     *  @returns ICountryData or null if not found
     */

    static getCountryByPhoneNumber(phoneNumber: string): ICountryData | null {
        // remove pluss
        if (phoneNumber.startsWith('+')) phoneNumber = phoneNumber.substring(1);

        // remove leading zeros
        phoneNumber = phoneNumber.replaceAll(/^[0]*/gi, '');
        if (phoneNumber.length < 6) {
            return null;
        }

        let guessCode = phoneNumber.substring(0, 4);
        let foundCountries = [];

        // Find country;
        for (let i of this.countries) {
            // match digits
            let m = 4;
            while (m-- > 0) {
                const code = parseInt(guessCode.substring(0, m));
                if (code === i.phoneCode) {
                    foundCountries.push(i);
                    break;
                }
            }
        }

        // KAZAKHSTAN AND RUSSIA, USA, PUERTO RIKO AND CANADA - CHECK!
        //foundedCountries[0][4] = phoneNumber.substr(foundedCountries[0][3].length);
        return foundCountries[0] ?? null;
    }
}
