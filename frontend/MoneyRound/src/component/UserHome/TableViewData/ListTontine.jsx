import  TableTemplate from "./TableTemplate";
function ListTontine(){
    const header=["N°","Tontine","Montant","Cycle actuel","Status"]
    const information=[
        ["1","Tontine 1","100000","1","En cours"],
        ["2","Tontine 2","100000","1","En cours"],
        ["3","Tontine 3","100000","1","En cours"],
        ["4","Tontine 4","100000","1","En cours"],
    ]
    return <TableTemplate header={header} information={information} flag={true}/>
}

export default ListTontine