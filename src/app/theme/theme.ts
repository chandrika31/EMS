export interface Theme {
  name: string;
  properties: any;
}

export const light_y: Theme = {
  name: "yellow",
  properties: {
    "--foreground-default": "#08090A",
    "--foreground-secondary": "#41474D",
    "--foreground-tertiary": "#797C80",
    "--foreground-quaternary": "#F4FAFF",
    "--foreground-light": "#41474D",

    "--background-default": "#FFC90E",

    "--comment-text-color": "#ffb102",

    "--pi-bg-highlight": "#fbf17a",

    "--border-default": "#f7e81b",

    "--panel-background": "#f5d049",

    "--tabview-nav-bgcolor": "#fff0bb",

    "--button-background": "#fcd23d",
    "--button-border": "#f1c629",

    "--pi-input-box-shadow": "#f1e782",

    "--border-color-default": "#f8d248",

    "--primary-default": "#5DFDCB",
    "--primary-dark": "#24B286",
    "--primary-light": "#B2FFE7",

    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(92, 125, 153, 0.5)"
  }
};

export const dark_g: Theme = {
  name: "green",
  properties: {
    "--foreground-default": "#5C7D99",
    "--foreground-secondary": "#A3B9CC",
    "--foreground-tertiary": "#F4FAFF",
    "--foreground-quaternary": "#E5E5E5",
    "--foreground-light": "#FFFFFF",

    "--background-default": "#157110",

    "--comment-text-color": "#157110",

    "--pi-bg-highlight": "#9bd469",

    "--border-default": "#7ED626;",

    "--panel-background": "#9dca71",

    "--border-color-default": "#a4d27d",

    "--tabview-nav-bgcolor": "#b6eab6",

    "--button-background": "#4CAF50",
    "--button-border": "#4CAF50",

    "--primary-default": "#5DFDCB",
    "--primary-dark": "#24B286",
    "--primary-light": "#B2FFE7",

    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(8, 9, 10, 0.5)"
  }
};

export const dark_b: Theme = {
  name: "blue",
  properties: {
    "--foreground-default": "#5C7D99",
    "--foreground-secondary": "#A3B9CC",
    "--foreground-tertiary": "#F4FAFF",
    "--foreground-quaternary": "#E5E5E5",
    "--foreground-light": "#FFFFFF",

    "--background-default": "#1271cb",

    "--comment-text-color": "#1271cb",

    "--tabview-nav-bgcolor": "#c6eafd",

    "--button-background": "#2b8fec",
    "--button-border": "#1f78ca",

    "--border-color-default": "#a5d0f9",

    "--pi-input-box-shadow": "#749ffc",

    "--pi-bg-highlight": "#5dc0f7",

    "--border-default": "#2d91ee",

    "--panel-background": "#49a5fc",

    "--primary-default": "#5DFDCB",
    "--primary-dark": "#24B286",
    "--primary-light": "#B2FFE7",

    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(8, 9, 10, 0.5)"
  }
};

export const light_r: Theme = {
  name: "red",
  properties: {
    "--foreground-default": "#5C7D99",
    "--foreground-secondary": "#A3B9CC",
    "--foreground-tertiary": "#F4FAFF",
    "--foreground-quaternary": "#E5E5E5",
    "--foreground-light": "#FFFFFF",

    "--background-default": "#E05C0A",

    "--comment-text-color": "#f77403",

    "--border-color-default": "#fdaf7f",

    "--tabview-nav-bgcolor": "#ffe0ba",

    "--border-default": "#ec7830",

    "--panel-background": "#f88e4c",

    "--pi-bg-highlight": "#ff9c62",

    "--button-background": "#ee772d",
    "--button-border": "#f17528",

    "--pi-input-box-shadow": "#ffa078",

    "--primary-default": "#5DFDCB",
    "--primary-dark": "#24B286",
    "--primary-light": "#B2FFE7",

    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(8, 9, 10, 0.5)"
  }
};