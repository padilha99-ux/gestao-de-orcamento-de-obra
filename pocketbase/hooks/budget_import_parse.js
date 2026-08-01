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

    if (typeof content !== 'string') {
      return e.badRequestError('Content must be a text string (CSV)')
    }

    if (content.length >= 2 && content.charCodeAt(0) === 80 && content.charCodeAt(1) === 75) {
      return e.badRequestError('Arquivos XLSX nao sao suportados. Converta para CSV.')
    }

    if (content.charCodeAt(0) === 65279) {
      content = content.substring(1)
    }

    var firstNewline = content.indexOf('\n')
    var firstLine = firstNewline !== -1 ? content.substring(0, firstNewline) : content
    var delimiter = ','
    var semicolonCount = 0
    var commaCount = 0
    var tabCount = 0
    for (var fi = 0; fi < firstLine.length; fi++) {
      if (firstLine[fi] === ';') semicolonCount++
      else if (firstLine[fi] === ',') commaCount++
      else if (firstLine[fi] === '\t') tabCount++
    }
    if (semicolonCount > commaCount && semicolonCount >= tabCount) delimiter = ';'
    else if (tabCount > commaCount && tabCount > semicolonCount) delimiter = '\t'

    var rows = []
    var currentRow = []
    var currentField = ''
    var inQuotes = false
    var ci = 0

    while (ci < content.length) {
      var char = content[ci]

      if (inQuotes) {
        if (char === '"') {
          if (content[ci + 1] === '"') {
            currentField += '"'
            ci += 2
          } else {
            inQuotes = false
            ci++
          }
        } else {
          currentField += char
          ci++
        }
      } else {
        if (char === '"') {
          inQuotes = true
          ci++
        } else if (char === delimiter) {
          currentRow.push(currentField)
          currentField = ''
          ci++
        } else if (char === '\r') {
          ci++
        } else if (char === '\n') {
          currentRow.push(currentField)
          currentField = ''
          if (currentRow.length > 0) rows.push(currentRow)
          currentRow = []
          ci++
        } else {
          currentField += char
          ci++
        }
      }
    }

    if (currentField !== '' || currentRow.length > 0) {
      currentRow.push(currentField)
      if (currentRow.length > 0) rows.push(currentRow)
    }

    if (rows.length < 2) return e.badRequestError('File has no data rows')

    var headers = rows[0].map(function (h, i) {
      var trimmed = String(h || '').trim()
      return trimmed !== '' ? trimmed : 'Column ' + (i + 1)
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

    if (dataRows.length === 0) return e.badRequestError('File has no data rows')

    return e.json(200, { headers: headers, rows: dataRows, sheetNames: ['Sheet1'] })
  },
  $apis.requireAuth(),
)
