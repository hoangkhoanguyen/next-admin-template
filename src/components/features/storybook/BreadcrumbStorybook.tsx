import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";

export function BreadcrumbStorybook() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Breadcrumb</CardTitle>
        <CardDescription>
          Demo and usage of Breadcrumb component
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Product Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </CardContent>
    </Card>
  );
}
