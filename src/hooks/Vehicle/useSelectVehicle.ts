import { useReducer } from 'react'
import { apiClient } from '../../lib/api_client'

export interface IVehicle {
  id: number
  year: number
  modelName: string
}

type State = {
  brands: Models.Brand[]
  years: number[]
  vehicles: IVehicle[]
  selectedBrand: Models.Brand
  selectedYear: null | number
  selectedVehicle: IVehicle
}

type Action =
  | {
      type: 'FETCH_BRANDS'
      payload: Models.Brand[]
    }
  | {
      type: 'CHANGE_BRAND'
      payload: {
        selectedBrand: Models.Brand
        years: number[]
      }
    }
  | {
      type: 'CHANGE_YEAR'
      payload: {
        selectedYear: number
        vehicles: IVehicle[]
      }
    }
  | {
      type: 'CHANGE_VEHICLE'
      payload: IVehicle
    }
  | { type: 'RESET_STATE' }

const initialState = {
  brands: [],
  years: [],
  vehicles: [],
  selectedBrand: {} as Models.Brand,
  selectedYear: null,
  selectedVehicle: {} as IVehicle,
}

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'FETCH_BRANDS':
      return {
        ...state,
        brands: action.payload,
      }
    case 'CHANGE_BRAND': {
      const { selectedBrand, years } = action.payload
      return {
        ...initialState,
        selectedBrand: selectedBrand,
        years: years,
      }
    }
    case 'CHANGE_YEAR': {
      const { selectedYear, vehicles } = action.payload
      return {
        ...state,
        selectedYear: selectedYear,
        selectedVehicle: {} as IVehicle,
        vehicles: vehicles,
      }
    }
    case 'CHANGE_VEHICLE':
      return {
        ...state,
        selectedVehicle: action.payload,
      }
    case 'RESET_STATE':
      return initialState
    default:
      return state
  }
}

export const useSelectVehicle = (): {
  state: State
  handle: {
    fetchBrands(): void
    changeBrand(brand: Models.Brand): void
    changeYear(year: number): void
    changeVehicle(vehicle: IVehicle): void
    resetState(): void
  }
} => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchBrands = () => {
    apiClient.get('/brands').then((response) => {
      dispatch({ type: 'FETCH_BRANDS', payload: response.data })
    })
  }

  const changeBrand = (brand: Models.Brand) => {
    apiClient.get(`/brands/${brand.id}`).then((response) => {
      dispatch({
        type: 'CHANGE_BRAND',
        payload: { selectedBrand: brand, years: response.data.years },
      })
    })
  }

  const changeYear = (year: number) => {
    apiClient
      .get(`/vehicles/?year=${year}&brand_id=${state.selectedBrand.id}`)
      .then((response) => {
        dispatch({
          type: 'CHANGE_YEAR',
          payload: { selectedYear: year, vehicles: response.data },
        })
      })
  }

  const changeVehicle = (vehicle: IVehicle) => {
    dispatch({ type: 'CHANGE_VEHICLE', payload: vehicle })
  }

  const resetState = () => dispatch({ type: 'RESET_STATE' })

  return {
    state,
    handle: {
      fetchBrands,
      changeBrand,
      changeYear,
      changeVehicle,
      resetState,
    },
  }
}
