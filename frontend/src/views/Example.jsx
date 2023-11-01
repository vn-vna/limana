import { useEffect } from "react"
import { useMatch } from "react-router"

export default function ExampleView() {
  const matches = useMatch('/ex/:param/*')

  useEffect(() => {
    console.log(matches?.params.param);
  }, [matches])

  return (
    <>
      <h1>Example {matches?.params.param}</h1>
    </>
  )
}