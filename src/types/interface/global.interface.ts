export type TValue = number | string;

export type TOption = {
    label: string;
    value: TValue;
};

export type TokenTOption = TOption & { imgUrl: string };
