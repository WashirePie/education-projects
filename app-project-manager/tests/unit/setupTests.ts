import { useStore } from "@/store"
import { ActionTypes } from "@/store/actions"

beforeAll(() => {
  const store = useStore()
  return store.dispatch(ActionTypes.setProjectToBePlanned, null)
})