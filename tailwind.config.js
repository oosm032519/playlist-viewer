module.exports = {
    content: ['./**/*.html', './**/*.ts'],
    theme: {
        extend: {
            colors: {
                'black-900': '#121212',
                'black-1000': '#000000',
                'green': {
                    '50': '#f0fdf4',
                    '100': '#dcfce7',
                    '200': '#bbf7d0',
                    '300': '#86efac',
                    '400': '#4ade80',
                    '500': '#2EBD59',
                    '600': '#16a34a',
                    '700': '#15803d',
                    '800': '#166534',
                    '900': '#14532d',
                },
                'bg-green': {
                    '50': '#f0fdf4',
                    '100': '#dcfce7',
                    '200': '#bbf7d0',
                    '300': '#86efac',
                    '400': '#4ade80',
                    '500': '#2EBD59',
                    '600': '#16a34a',
                    '700': '#15803d',
                    '800': '#166534',
                    '900': '#14532d',
                },
            },
            spacing: {
                '1': '8px',
                '2': '12px',
                '3': '16px',
                '4': '24px',
                '5': '32px',
                '6': '48px',
            },
            backgroundColor: theme => ({
                ...theme('colors'),
                'primary': '#2EBD59',
                'secondary': '#F2F2F2',
                'danger': '#E3342F',
            })
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
