declare namespace service {
  interface SimpleResponse<T> { (error: Error, response?: T): void; }
  interface DeleteResponse { result: boolean; }
  interface UpdatedSimpleResponse { affectedCount: number }
  interface UpdatedFullResponse<T> { affectedCount: number, affectedRows: T }

  interface apiService { }

  interface ClienteService extends service.apiService {
    create(cliente: model.Cliente): Promise<model.Cliente>;
    list(): Promise<model.Cliente[]>;
    getById(id: number): Promise<model.Cliente>;
    update(cliente: model.Cliente): Promise<model.Cliente>;
    delete(id: number): Promise<service.DeleteResponse>;
  }

  interface UserService extends service.apiService {
    create(user: model.User): Promise<model.User>;
    getRolesByExternalId(id: string): Promise<string[]>;
    setRolesByExternalId(data: { id: string; roles: string[] }): Promise<string[]>;
  }
}

