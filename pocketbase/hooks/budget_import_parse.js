// @deps xlsx@0.18.5
routerAdd(
  'POST',
  '/backend/v1/budget-import/parse',
  (e) => {
    if (!e.auth) return e.unauthorizedError('auth required')
    var role = e.auth.getString('role')
    if (role !== 'admin') return e.forbiddenError('Admin access required')

    var body = e.requestInfo().body || {}
    var content = body.content
    if (!content) return e.badRequestError('File content is required')

    var XLSX = require('xlsx')
    var workbook
    try {
      workbook = XLSX.read(content, { type: 'base64' })
    } catch (err) {
      return e.badRequestError('Could not parse file: ' + String(err.message || err))
    }

    var sheetName = workbook.SheetNames[0]
    if (!sheetName) return e.badRequestError('Spreadsheet has no sheets')

    var sheet = workbook.Sheets[sheetName]
    var rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false })

    if (!rows || rows.length < 2) return e.badRequestError('Spreadsheet has no data rows')

    var headers = rows[0].map(function (h, i) {
      return String(h || 'Column ' + (i + 1))
    })
    var dataRows = rows
      .slice(1)
      .filter(function (r) {
        return r.some(function (c) {
          return String(c).trim() !== ''
        })
      })
      .map(function (row) {
        var obj = {}
        headers.forEach(function (h, i) {
          obj[h] = row[i] !== undefined ? String(row[i]) : ''
        })
        return obj
      })

    return e.json(200, { headers: headers, rows: dataRows, sheetNames: workbook.SheetNames })
  },
  $apis.requireAuth(),
)
