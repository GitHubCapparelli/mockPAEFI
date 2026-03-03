// packages/model/ddd/enums/_baseEnum.js
export class BaseEnum {
    static All = [];

    static FromKey(key)         { return this.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)     { return this.All.find(x => x.Value === value) ?? null; }

    static ValueFromKey(key)    { return this.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value)  { return this.FromValue(value)?.Key ?? null; }
}