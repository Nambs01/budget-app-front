export function formatAriary(amount: number | string): string {
    const num = Number(amount)
    return `${num.toLocaleString('fr-MG')} Ar`
}
