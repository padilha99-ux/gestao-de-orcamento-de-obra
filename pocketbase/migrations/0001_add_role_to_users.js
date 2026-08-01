migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!col.fields.getByName('role')) {
      col.fields.add(
        new SelectField({
          name: 'role',
          required: false,
          values: ['admin', 'consultor'],
          maxSelect: 1,
        }),
      )
    }

    col.createRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    col.updateRule = "@request.auth.id != '' && @request.auth.role = 'admin'"

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')
    col.createRule = ''
    col.updateRule = 'id = @request.auth.id'
    app.save(col)
  },
)
