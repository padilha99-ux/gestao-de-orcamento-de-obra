migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'padilha99@hotmail.com')
    } catch (_) {
      const admin = new Record(users)
      admin.setEmail('padilha99@hotmail.com')
      admin.setPassword('Skip@Pass')
      admin.setVerified(true)
      admin.set('name', 'Administrador')
      admin.set('role', 'admin')
      app.save(admin)
    }

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'consultor@example.com')
    } catch (_) {
      const consultor = new Record(users)
      consultor.setEmail('consultor@example.com')
      consultor.setPassword('Skip@Pass')
      consultor.setVerified(true)
      consultor.set('name', 'Consultor')
      consultor.set('role', 'consultor')
      app.save(consultor)
    }
  },
  (app) => {
    try {
      const consultor = app.findAuthRecordByEmail('_pb_users_auth_', 'consultor@example.com')
      app.delete(consultor)
    } catch (_) {}
  },
)
