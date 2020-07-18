import _ from "lodash";

// 'dd/mm/yyyy' -> 'yyyy-mm'
const toInputMonthFormat = (dbDate) => {
    const [, month, year] = dbDate.split('/')

    return [year, month].join('-')
}

const isDateAfter = (dateA, dateB) => new Date(dateA) >= new Date(dateB)
const isDateBefore = (dateA, dateB) => new Date(dateA) <= new Date(dateB)

const getTagsMap = (transactions) => {
    return _.reduce(transactions, (acc, transaction, i) => {
        _.forEach(transaction.tags, tag => {
            acc[tag] = acc[tag] || {}
            acc[tag][i] = true
        })

        return acc
    }, {})
}


export const filter = (transactions, {showRead = true, startMonth = '', endMonth = '', tagsFilter = []}) => {
    const tagsMap = getTagsMap(transactions)
    const shouldShowItem = (transaction, i) => {
        return (showRead || !transaction.isRead) &&
            (!startMonth || isDateAfter(toInputMonthFormat(transaction.date), startMonth)) &&
            (!endMonth || isDateBefore(toInputMonthFormat(transaction.date), endMonth)) &&
            (_.isEmpty(tagsFilter) || _.every(tagsFilter, tag => _.get(tagsMap, [tag, i], false)))
    }

    return transactions.filter(shouldShowItem)
}
