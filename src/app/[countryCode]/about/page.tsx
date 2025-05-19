"use client"

import { Container } from "@medusajs/ui"

const AboutPage = () => {
  return (
    <Container>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">About Coshop</h1>
          
          <div className="prose prose-lg">
            <section className="mb-8">
              <p className="text-gray-600 mb-4">
                CoShop is a technology platform that connects communities to local food producers – shortening 
                supply chains to provide cheaper, fresher food and reduce climate emissions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">The Problem</h2>
              <p className="text-gray-600 mb-4">
                In Aotearoa New Zealand, food systems contribute to over 50% of emissions. Long, refrigerated 
                supply chains intensify these emissions while the supermarket duopoly creates unfair margins, 
                leaving farmers underpaid and consumers facing inflated food costs. This disproportionately 
                affects vulnerable populations, as shown by the 42% increase in demand for food banks in 2023.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Solution</h2>
              <p className="text-gray-600 mb-4">
                We&apos;ve partnered with Wesley Community Action&apos;s Wellington Fruit and Vege Co-op network, 
                which currently sells over $1M in fresh produce per year. Our pilot at the Karori Community 
                Center demonstrates how technology can streamline the existing model where volunteers repackage 
                bulk groceries into $15 bags of produce worth ~$25 at supermarket prices.
              </p>
              <p className="text-gray-600 mb-4">
                As a pure software solution, CoShop requires no physical infrastructure, allowing us to focus 
                on community needs while keeping costs low. The platform can scale across Aotearoa and globally, 
                adapting to local needs through community partnerships.
              </p>
            </section>

            <section>
              <p className="text-gray-600">
                Want to stay updated on our progress? Subscribe to our{" "}
                <a 
                  href="https://coshop.substack.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Substack newsletter
                </a>
                {" "}for updates and investment opportunities.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default AboutPage 