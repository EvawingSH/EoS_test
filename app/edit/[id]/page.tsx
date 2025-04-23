import EditItemForm from "./EditItemForm"
import servicesData from "../../data/services.json"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditPage({ params }: PageProps) {
  // Get the ID from params
  const id = params.id

  // Find the service in the JSON data
  const service = servicesData.services.find((s) => s.id === id) || null

  return <EditItemForm id={id} initialService={service} />
}
