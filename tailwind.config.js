const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                'grid-pattern': "linear-gradient(to bottom, theme('colors.neutral.950 / 0%'), theme('colors.neutral.950 / 100%')), url('/images/noise.png')"
            },
            colors: {
                neutral: colors.neutral,
                paleLavender: {
                    DEFAULT: '#e0d6f5', // Default shade of Pale Lavender
                    light: '#ddd6f3' // Lighter shade of Pale Lavender
                },
                lightgray: {
                    70: '#f7f7f7',  // Very slightly darker than 50
                    60: '#f8f8f8',  // Just a touch darker than 50
                    50: '#fafafa',  // Extremely light gray (unchanged)
                    25: '#fcfcfc',  // Almost white (unchanged)
                    10: '#fdfdfd',  // Nearly indistinguishable from white (unchanged)
                    5: '#fefefe',   // Very subtle light gray (unchanged)
                },
                coral: {
                    100: '#F9E4E1',  // Very light coral
                    200: '#F2CAC5',  // Lighter coral
                    300: '#EBB0A9',  // Light coral
                    400: '#E39384',  // Main coral color (#E39384)
                    500: '#DB7360',  // Slightly darker
                    600: '#C95E4D',  // Dark coral
                    700: '#A74940',  // Deeper tone
                    800: '#843732',  // Even darker coral
                    900: '#662823',  // Very dark coral
                },
                mixed: {
                    100: 'rgb(247, 128, 110)',
                    200: 'rgb(235, 130, 115)',
                    300: 'rgb(235, 130, 115)',
                    400: 'rgb(235, 130, 115)',
                    500: 'rgb(220, 105, 87)',
                    600: 'rgb(205, 80, 60)',
                },
                salmon: '#FA8072',  // You can adjust this hex code to get the exact shade you want
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                cursive: ['"Dancing Script"', 'cursive'],
            },
            fontSize: {
                xsm: '0.75rem',   // Smaller than sm (12px)
                'sxsm': '0.8125rem', // Size between sm and xsm (13px)
            },
            fontWeight: {
                '550': '550',
            },
            maxWidth: {
                '95': '95%', // Custom max width for 90%
            },
            spacing: {
                '14': '3.5rem',
                '15': '3.75rem',
                '16': '4rem',
                '17': '4.25rem',
                '18': '4.5rem',
                '19': '4.75rem',
                '20': '5rem',
                '21': '5.25rem',
                '22': '5.5rem',
                '23': '5.75rem',
                '24': '6rem',
                '25': '6.25rem',
                '26': '6.5rem',
                '27': '6.75rem',
                '28': '7rem',
                '32': '8rem',
            },
            height: {
                '350': '350px',
                '35': '7.25rem', // This adds a new h-35 class
            },
            textShadow: {
                'lg': '0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)',
            },
        }
    },
    daisyui: {
        themes: [
            {
                lofi: {
                    ...require('daisyui/src/theming/themes')['lofi'],
                    primary: '#2bdcd2',
                    'primary-content': '#171717',
                    secondary: '#016968',
                    info: '#2bdcd2',
                    'info-content': '#171717',
                }
            }
        ]
    },
    plugins: [
        require('daisyui'),
        function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme('textShadow') }
            )
        },
    ],
};
