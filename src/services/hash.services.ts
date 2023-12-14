import bcrypte from 'bcrypt';

export class HashServices {
    protected salt: number;
    protected plainText: string;

    constructor(plainText: string) {
        const salt = bcrypte.genSaltSync(12);
        this.plainText = plainText;
        this.salt = parseInt(salt);
    }

    public async hash(): Promise<string> {
        return await bcrypte.hashSync(this.plainText, this.salt);
    }

    public compare(hash: string): boolean {
        return bcrypte.compareSync(this.plainText, hash);
    }
}
