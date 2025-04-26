export interface BaseTableLine {
    id: number,
}

export abstract class AbstractLocalTable {
    static define(name: string): void { throw Error("Not Implemented.") };
    getAll<TableLine extends BaseTableLine>(): TableLine[] 
        { throw Error("Not Implemented.") };
    setAll
        <TableLine extends Omit<BaseTableLine, "id">>
        (value: TableLine[]): void 
        { throw Error("Not Implemented.") };

}


export class LocalTable extends AbstractLocalTable {
    private idTrack: number;
    public readonly name: string;

    constructor(name: string) {
        super();

        this.name = name;
        this.idTrack = 1;
    }

    public static define(name: string)
    {
        /*
            Define an empty table on localStorage with the given a name. 
        */
        localStorage.setItem(name, JSON.stringify([]));
    }
    public getAll<TableLine extends BaseTableLine>(): TableLine[] 
    {
        /*
            Get the whole table from localStorage given the table name. 
        */

        let string_table = localStorage.getItem(this.name);

        if (!string_table) 
            throw `localStorage.getItem with table ${this.name} didn't return.`; 

        let table = JSON.parse(string_table);

        return table;
    }
    public setAll
        <TableLineWithoutId extends Omit<BaseTableLine, "id">>
        (value: TableLineWithoutId[]) 
    {
        /*
            Set all lines of the table, given the table name and a new value. 
        */

        type TableLine = TableLineWithoutId & BaseTableLine; 

        const newTable = value.map((v) => {
            let newTableLine: TableLine = { id: this.idTrack, ...v }; 
            this.idTrack = this.idTrack + 1;

            return newTableLine;
        })

        const table_string = JSON.stringify(newTable);
        localStorage.setItem(this.name, table_string);
    }
}

export default LocalTable;