export class EssentialData implements IEssentialAccountData {
    private value: number;
    private id: string;
    constructor(id: string, initialValue: number) {
        this.value = initialValue;
        this.id = id;
    }

    getId() {
        return this.id;
    }
    getAmount() {
        return this.value;
    }

    setAmount(value: number) {
        this.value = value;
    }
}

export interface IEssentialAccountData {
    getId(): string;
    getAmount(): number;

    setAmount(value: number);
}
