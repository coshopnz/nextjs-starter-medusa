import { Github } from "@medusajs/icons"
import { Button, Heading, Text } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[30vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-16 gap-4">
        <span>
          <Heading
            level="h1"
            className="text-2xl leading-8 text-ui-fg-base font-normal"
          >
            Ordering Now Open
          </Heading>
          <Heading
            level="h1"
            className="text-2xl leading-8 text-ui-fg-base font-normal"
          >
            For Thursday 14th November Pickup
          </Heading>
          <Text>
            8:30am-10am and 5pm-6pm from the Karori Community Centre
          </Text>
        </span>
        <a
          href="https://karori.coshop.nz/nz/store"
        >
          <Button variant="secondary">
            Order Here
          </Button>
        </a>
      </div>
    </div>
  )
}

export default Hero
