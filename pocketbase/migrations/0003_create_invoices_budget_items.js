migrate(
  (app) => {
    const categoriesId = app.findCollectionByNameOrId('categories').id
    const stagesId = app.findCollectionByNameOrId('stages').id

    const invoices = new Collection({
      name: 'invoices',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        { name: 'number', type: 'text', required: true },
        { name: 'supplier', type: 'text', required: true },
        { name: 'amount', type: 'number', required: true, min: 0 },
        { name: 'issue_date', type: 'date', required: true },
        {
          name: 'category',
          type: 'relation',
          required: true,
          collectionId: categoriesId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        {
          name: 'stage',
          type: 'relation',
          required: true,
          collectionId: stagesId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        {
          name: 'payment_status',
          type: 'select',
          required: false,
          values: ['Pendente', 'Pago'],
          maxSelect: 1,
        },
        { name: 'description', type: 'text', required: false },
        { name: 'observations', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_invoices_category ON invoices (category)',
        'CREATE INDEX idx_invoices_stage ON invoices (stage)',
        'CREATE INDEX idx_invoices_payment_status ON invoices (payment_status)',
        'CREATE INDEX idx_invoices_issue_date ON invoices (issue_date)',
      ],
    })
    app.save(invoices)

    const budgetItems = new Collection({
      name: 'budget_items',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        { name: 'item', type: 'text', required: false },
        {
          name: 'stage',
          type: 'relation',
          required: false,
          collectionId: stagesId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        { name: 'planned_value', type: 'number', required: true, min: 0 },
        {
          name: 'category',
          type: 'relation',
          required: true,
          collectionId: categoriesId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        { name: 'planned_date', type: 'date', required: true },
        { name: 'responsible', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_budget_items_category ON budget_items (category)',
        'CREATE INDEX idx_budget_items_stage ON budget_items (stage)',
      ],
    })
    app.save(budgetItems)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('invoices'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('budget_items'))
    } catch (_) {}
  },
)
