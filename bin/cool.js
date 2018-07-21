let compareVersion, toVersion, versionToInt, versionToInt3
toVersion = s => s.split('.').map(x => parseInt(x))
compareVersion = (a, b) => {
  a = toVersion(a)
  b = toVersion(b)
  for (let n = 0, len = Math.max(a.length, b.length); n < len; n++) {
    let diff = (a[n] || -1) - (b[n] || -1)
    // console.log((a[n] || -1), (b[n] || -1), diff, diff !== 0)
    if (diff !== 0) return Math.sign(diff)
  }
  return 0
}
console.log(compareVersion('1', '2'), -1)
console.log(compareVersion('2', '1'), 1)
console.log(compareVersion('1', '1.2'), -1)
console.log(compareVersion('1.2', '1'), 1)
console.log(compareVersion('1.1', '1.1'), 0)
console.log(compareVersion('1.2.3', '1.2.4.5'), -1)
console.log(compareVersion('1.2.3.6', '1.2.4'), 1)

versionToInt = len =>
  v => toVersion(v).reverse()
    .reduce(
      (acc, val, ind) => acc + (val * Math.pow(10, len * ind)), 0)
versionToInt3 = versionToInt(3)

console.log(versionToInt3('111'), 111000000)
console.log(versionToInt3('111.222.333'), 111222333)
console.log(versionToInt3('111.2.0'), 111002000)
