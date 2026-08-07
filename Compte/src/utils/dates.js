/***
 * récupère le mois suivant, a partie de la date donnée, ajoute 1 au mois ou a l'année
 * @param {string}  dateString - mois de départ au format "YYYY-MM"
 * @returns {string} le mois suivant au même format "YYYY-MM"
 */
export function getNextMonth(dateString) {
    const dateSplit = dateString.split("-")
    const yearNumber = Number(dateSplit[0])
    const monthNumber = Number(dateSplit[1])

    let nextYear
    let nextMonth

    if(monthNumber === 12){
        nextMonth = 1
        nextYear = yearNumber + 1
    }else{
        nextMonth = monthNumber + 1
        nextYear = yearNumber
    }
    const nextMonthPadded = String(nextMonth).padStart(2, "0")

    return `${nextYear}-${nextMonthPadded}`
}