export function calculatePunctuation(position: number, abates: number): number {
  switch (position) {
    case 1:
      return 12 + abates;
    case 2:
      return 9 + abates;
    case 3:
      return 8 + abates;
    case 4:
      return 7 + abates;
    case 5:
      return 6 + abates;
    case 6:
      return 5 + abates;
    case 7:
      return 4 + abates;
    case 8:
      return 3 + abates;
    case 9:
      return 2 + abates;
    case 10:
      return 1 + abates;
    default:
      return abates;
  }
}
