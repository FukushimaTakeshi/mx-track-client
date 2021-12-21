import { AxiosError } from 'axios'

type ResourceState<T, E> =
  | {
      status: 'idle'
      value: null
      promise: null
      error: null
    }
  | {
      status: 'loading'
      value: null
      promise: Promise<void>
      error: null
    }
  | {
      status: 'success'
      value: T
      promise: unknown
      error: null
    }
  | {
      status: 'failure'
      value: null
      promise: unknown
      error: E
    }

export class Resource<T, E = AxiosError> {
  #state: ResourceState<T, E>
  #fetcher: () => Promise<T>

  constructor(fetcher: () => Promise<T>) {
    this.#state = {
      status: 'idle',
      value: null,
      promise: null,
      error: null,
    }
    this.#fetcher = fetcher
  }

  run(): Promise<void> {
    this.#state = {
      status: 'loading',
      promise: this.#fetcher().then(
        (x) => {
          this.#state = {
            status: 'success',
            promise: this.#state.promise,
            value: x,
            error: null,
          }
        },
        (x) => {
          this.#state = {
            status: 'failure',
            promise: this.#state.promise,
            value: null,
            error: x,
          }
          throw x
        }
      ),
      error: null,
      value: null,
    }
    return this.#state.promise
  }

  read(): T {
    switch (this.#state.status) {
      case 'idle': {
        throw this.run()
      }
      case 'loading': {
        throw this.#state.promise
      }
      case 'failure': {
        throw this.#state.error
      }
      case 'success': {
        return this.#state.value
      }
    }
  }
}
