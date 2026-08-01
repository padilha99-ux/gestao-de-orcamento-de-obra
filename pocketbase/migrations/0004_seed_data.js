migrate(
  (app) => {
    const categoriesCol = app.findCollectionByNameOrId('categories')
    const stagesCol = app.findCollectionByNameOrId('stages')
    const invoicesCol = app.findCollectionByNameOrId('invoices')
    const budgetItemsCol = app.findCollectionByNameOrId('budget_items')

    var categoryIds = {}
    var categoryNames = [
      'Materiais',
      'M\u00e3o de Obra',
      'Equipamentos',
      'Servi\u00e7os Terceirizados',
      'Licen\u00e7as e Taxas',
    ]
    for (var i = 0; i < categoryNames.length; i++) {
      try {
        app.findFirstRecordByData('categories', 'name', categoryNames[i])
      } catch (_) {
        var rec = new Record(categoriesCol)
        rec.set('name', categoryNames[i])
        app.save(rec)
      }
    }

    var stageNames = [
      'Funda\u00e7\u00e3o',
      'Estrutura',
      'Alvenaria',
      'Acabamento',
      'Instala\u00e7\u00f5es El\u00e9tricas',
      'Instala\u00e7\u00f5es Hidr\u00e1ulicas',
    ]
    for (var j = 0; j < stageNames.length; j++) {
      try {
        app.findFirstRecordByData('stages', 'name', stageNames[j])
      } catch (_) {
        var sRec = new Record(stagesCol)
        sRec.set('name', stageNames[j])
        app.save(sRec)
      }
    }

    var allCats = app.findRecordsByFilter('categories', '', 'name', 0, 0)
    for (var k = 0; k < allCats.length; k++) {
      categoryIds[allCats[k].getString('name')] = allCats[k].id
    }
    var allStages = app.findRecordsByFilter('stages', '', 'name', 0, 0)
    var stageIds = {}
    for (var m = 0; m < allStages.length; m++) {
      stageIds[allStages[m].getString('name')] = allStages[m].id
    }

    var budgetSeed = [
      {
        item: 'Materiais - Funda\u00e7\u00e3o',
        stage: 'Funda\u00e7\u00e3o',
        cat: 'Materiais',
        val: 45000,
        date: '2026-01-15',
        resp: 'Jo\u00e3o Silva',
      },
      {
        item: 'M\u00e3o de Obra - Funda\u00e7\u00e3o',
        stage: 'Funda\u00e7\u00e3o',
        cat: 'M\u00e3o de Obra',
        val: 30000,
        date: '2026-01-20',
        resp: 'Pedro Santos',
      },
      {
        item: 'Licen\u00e7as - Funda\u00e7\u00e3o',
        stage: 'Funda\u00e7\u00e3o',
        cat: 'Licen\u00e7as e Taxas',
        val: 5000,
        date: '2026-01-10',
        resp: 'Maria Oliveira',
      },
      {
        item: 'Materiais - Estrutura',
        stage: 'Estrutura',
        cat: 'Materiais',
        val: 80000,
        date: '2026-02-01',
        resp: 'Jo\u00e3o Silva',
      },
      {
        item: 'M\u00e3o de Obra - Estrutura',
        stage: 'Estrutura',
        cat: 'M\u00e3o de Obra',
        val: 55000,
        date: '2026-02-10',
        resp: 'Pedro Santos',
      },
      {
        item: 'Equipamentos - Estrutura',
        stage: 'Estrutura',
        cat: 'Equipamentos',
        val: 25000,
        date: '2026-02-15',
        resp: 'Ana Costa',
      },
      {
        item: 'Materiais - Alvenaria',
        stage: 'Alvenaria',
        cat: 'Materiais',
        val: 35000,
        date: '2026-03-01',
        resp: 'Jo\u00e3o Silva',
      },
      {
        item: 'Servi\u00e7os - Acabamento',
        stage: 'Acabamento',
        cat: 'Servi\u00e7os Terceirizados',
        val: 40000,
        date: '2026-04-01',
        resp: 'Maria Oliveira',
      },
      {
        item: 'Materiais - El\u00e9trica',
        stage: 'Instala\u00e7\u00f5es El\u00e9tricas',
        cat: 'Materiais',
        val: 20000,
        date: '2026-03-15',
        resp: 'Carlos Ferreira',
      },
      {
        item: 'Materiais - Hidr\u00e1ulica',
        stage: 'Instala\u00e7\u00f5es Hidr\u00e1ulicas',
        cat: 'Materiais',
        val: 18000,
        date: '2026-03-20',
        resp: 'Carlos Ferreira',
      },
    ]

    for (var b = 0; b < budgetSeed.length; b++) {
      var bs = budgetSeed[b]
      try {
        app.findFirstRecordByData('budget_items', 'item', bs.item)
      } catch (_) {
        var bRec = new Record(budgetItemsCol)
        bRec.set('item', bs.item)
        bRec.set('stage', stageIds[bs.stage])
        bRec.set('planned_value', bs.val)
        bRec.set('category', categoryIds[bs.cat])
        bRec.set('planned_date', bs.date)
        bRec.set('responsible', bs.resp)
        app.save(bRec)
      }
    }

    var invoiceSeed = [
      {
        num: 'NF-001',
        sup: 'Construmateriais Ltda',
        amt: 42500,
        date: '2026-01-18',
        cat: 'Materiais',
        stage: 'Funda\u00e7\u00e3o',
        status: 'Pago',
        desc: 'Compra de cimento e areia',
        obs: '',
      },
      {
        num: 'NF-002',
        sup: 'Pedro Santos ME',
        amt: 32000,
        date: '2026-01-25',
        cat: 'M\u00e3o de Obra',
        stage: 'Funda\u00e7\u00e3o',
        status: 'Pago',
        desc: 'M\u00e3o de obra funda\u00e7\u00e3o',
        obs: '',
      },
      {
        num: 'NF-003',
        sup: 'Construmateriais Ltda',
        amt: 88000,
        date: '2026-02-05',
        cat: 'Materiais',
        stage: 'Estrutura',
        status: 'Pago',
        desc: 'Compra de a\u00e7o e concreto',
        obs: 'Pre\u00e7o maior que previsto',
      },
      {
        num: 'NF-004',
        sup: 'Pedro Santos ME',
        amt: 56000,
        date: '2026-02-15',
        cat: 'M\u00e3o de Obra',
        stage: 'Estrutura',
        status: 'Pago',
        desc: 'M\u00e3o de obra estrutura',
        obs: '',
      },
      {
        num: 'NF-005',
        sup: 'Locadora de Equipamentos',
        amt: 23000,
        date: '2026-02-20',
        cat: 'Equipamentos',
        stage: 'Estrutura',
        status: 'Pago',
        desc: 'Aluguel de guindaste',
        obs: '',
      },
      {
        num: 'NF-006',
        sup: 'Construmateriais Ltda',
        amt: 28000,
        date: '2026-03-05',
        cat: 'Materiais',
        stage: 'Alvenaria',
        status: 'Pendente',
        desc: 'Compra de tijolos e cal',
        obs: '',
      },
      {
        num: 'NF-007',
        sup: 'El\u00e9trica Total Ltda',
        amt: 15500,
        date: '2026-03-18',
        cat: 'Materiais',
        stage: 'Instala\u00e7\u00f5es El\u00e9tricas',
        status: 'Pendente',
        desc: 'Fios e condu\u00edtes',
        obs: '',
      },
      {
        num: 'NF-008',
        sup: 'Hidro Servi\u00e7os',
        amt: 12000,
        date: '2026-03-22',
        cat: 'Materiais',
        stage: 'Instala\u00e7\u00f5es Hidr\u00e1ulicas',
        status: 'Pendente',
        desc: 'Tubos e conex\u00f5es',
        obs: '',
      },
      {
        num: 'NF-009',
        sup: 'Prefeitura Municipal',
        amt: 5000,
        date: '2026-01-12',
        cat: 'Licen\u00e7as e Taxas',
        stage: 'Funda\u00e7\u00e3o',
        status: 'Pago',
        desc: 'Taxa de alvar\u00e1',
        obs: '',
      },
      {
        num: 'NF-010',
        sup: 'Acabamentos Premium',
        amt: 38000,
        date: '2026-04-05',
        cat: 'Servi\u00e7os Terceirizados',
        stage: 'Acabamento',
        status: 'Pendente',
        desc: 'Servi\u00e7os de pintura e revestimento',
        obs: '',
      },
    ]

    for (var n = 0; n < invoiceSeed.length; n++) {
      var is = invoiceSeed[n]
      try {
        app.findFirstRecordByData('invoices', 'number', is.num)
      } catch (_) {
        var iRec = new Record(invoicesCol)
        iRec.set('number', is.num)
        iRec.set('supplier', is.sup)
        iRec.set('amount', is.amt)
        iRec.set('issue_date', is.date)
        iRec.set('category', categoryIds[is.cat])
        iRec.set('stage', stageIds[is.stage])
        iRec.set('payment_status', is.status)
        iRec.set('description', is.desc)
        iRec.set('observations', is.obs)
        app.save(iRec)
      }
    }
  },
  (app) => {
    var invoices = app.findRecordsByFilter('invoices', 'number ~ "NF-"', '', 0, 0)
    for (var i = 0; i < invoices.length; i++) {
      app.delete(invoices[i])
    }
    var items = app.findRecordsByFilter('budget_items', 'item != ""', '', 0, 0)
    for (var j = 0; j < items.length; j++) {
      app.delete(items[j])
    }
  },
)
