import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const Noir = definePreset(Aura, {
    components: {
        inputnumber: {
            button: {
                width: '3rem'
            }
        },
        dropdown: {
            background: 'transparent'
        },
        autocomplete:
            { dropdown: { background: 'red' } },
        message: {
            error:
            {
                color: '#f87171',
                simple: {
                    color: '#f87171',
                }
            }
        },
        multiselect: {
        },

        toggleswitch: {
            handle: {
                size: '1.25rem'
            }
        },
        treeselect: {
            chip: {
            },
            tree: {
                padding: '0.5rem'
            }
        }
    },
    semantic: {
        primary: {
            "50": "#fef2f2",
            "100": "#fee2e2",
            "200": "#fecaca",
            "300": "#fca5a5",
            "400": "#f87171",
            "500": "#d53425", // Ваш основной цвет
            "600": "#b91c1c",
            "700": "#991b1b",
            "800": "#7f1d1d",
            "900": "#6b1410",
            "950": "#450a0a"
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617'
                },
                primary: {
                    color: '#d53425',
                    contrastColor: '#ffffff',
                    hoverColor: '#b91c1c', // Сделан чуть темнее (эквивалент 600) для отклика при наведении
                    activeColor: '#991b1b'  // Сделан еще темнее (эквивалент 700) для состояния нажатия
                },
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.700}',
                    focusColor: '{primary.800}'
                }
            },
            dark: {
                surface: {
                    "50": "#3e3e40",
                    "100": "#363638",
                    "200": "#18181b",
                    "300": "#2a2a2c",
                    "400": "#57575C",
                    "500": "#222224",
                    "600": "#1e1e20",
                    "700": "#1a1a1c",
                    "800": "#161618",
                    "900": "#121214",
                    "950": "#0f0f11"
                },
                primary: {
                    color: '#d53425',
                    contrastColor: '#ffffff',
                    hoverColor: '#f87171', // В темной теме при наведении лучше использовать более светлый оттенок (400)
                    activeColor: '#fca5a5'  // При нажатии в темной теме — еще светлее (300)
                },
                highlight: {
                    background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                    focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        },
        formField: {
            paddingX: "0.75rem",
            paddingY: "0.75rem",
            sm: {
                fontSize: "0.875rem",
                paddingX: "0.625rem",
                paddingY: "0.375rem"
            },
            lg: {
                fontSize: "1.125rem",
                paddingX: "0.875rem",
                paddingY: "0.625rem"
            },
            borderRadius: "{border.radius.md}",
            focusRing: {
                width: "0",
                style: "none",
                color: "transparent",
                offset: "0",
                shadow: "none"
                // Если захотите вернуть обводку фокуса: "0 0 0 2px {primary.500}"
            },
            transitionDuration: "{transition.duration}"
        },
        navigation: {
            list: {
                padding: "0.25rem 0.25rem",
                gap: "2px"
            },
            item: {
                padding: "0.75rem 0.75rem",
                borderRadius: "{border.radius.sm}",
                gap: "0.5rem"
            },
            submenuLabel: {
                padding: "0.5rem 0.75rem",
                fontWeight: "600"
            },
            submenuIcon: {
                size: "0.875rem"
            }
        },
        list: {
            padding: "0.25rem 0.25rem",
            gap: "2px",
            header: {
                padding: "0.5rem 1rem 0.25rem 1rem"
            },
            option: {
                padding: "0.75rem 0.75rem",
                borderRadius: "{border.radius.sm}"
            },
            optionGroup: {
                padding: "0.75rem 0.75rem",
                fontWeight: "600"
            }
        }
    }

});