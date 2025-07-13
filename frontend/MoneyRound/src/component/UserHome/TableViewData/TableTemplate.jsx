//Importation de feuilles de style
import '../../../styles/UserHome/TableViewData/TableTemplate.css';

//Importation de composant
import {useState} from "react";
const search=(info,eltResearch,forbidenIndex=[])=>{
    const result=[]
    info.forEach(elt=>{
        for (let i=0;i<elt.length;i++){
            // On entre biensur si ce n'est pas une valeur interdite
            if(!forbidenIndex.includes(i)){
                //verification si c'est un entier
                if(typeof elt[i]==="number"){
                    if(elt[i]===eltResearch){
                        result.push(i)
                    }
                }
                // verification si c'est une chaine de caractère
                else if(typeof elt[i]==="string"){
                    if(elt[i].toLowerCase().includes(eltResearch.toLowerCase())){
                        result.push(i)
                    }
                }
            }
        }
    })
}


/**
 * @param {Array <string>} header
 * @param {Array} information
 * @param {boolean} flag=false
 * */

function TableTemplate({header, information, flag = false}){
    const [buzz,isBuzz]=useState(flag)
    return (<table>
        <thead>
        <tr>

            {header.map((item, index) => (
                <th key={index}>
                    {item} <input type="checkbox" />
                </th>
            ))}
        </tr>
        </thead>
        <tbody>
        {information.map((item, index) => (
            <tr key={index}>
                {item.map((item2, index2) => (
                    <td key={index2}>{item2}</td>
                ))}
            </tr>
        ))}
        </tbody>
        </table>
    );
}

export default TableTemplate