import * as React from "react"
import { Button } from "./button"

interface FooterProps {
  logo: React.ReactNode
  brandName: string
  socialLinks: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks: Array<{
    href?: string
    label: string
    onClick?: () => void
  }>
  copyright: {
    text: string
    license?: string
  }
}

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-24 w-full border-t border-black/10 dark:border-white/10 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-2"
            aria-label={brandName}
          >
            {logo}
            <span className="font-bold text-xl text-zinc-900 dark:text-white">{brandName}</span>
          </a>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  asChild
                >
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-black/10 dark:border-white/10 mt-6 pt-6 md:mt-4 md:pt-8 flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
            <Button variant="outline" asChild className="w-fit">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=blockwebsupport@gmail.com" target="_blank" rel="noopener noreferrer">Email Support</a>
            </Button>
            {copyright.license && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {copyright.license}
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
            <div className="text-sm leading-6 text-zinc-500 dark:text-zinc-400 whitespace-nowrap flex items-center gap-2">
              <span>{copyright.text}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              {mainLinks.map((link, i) => (
                link.onClick ? (
                  <button
                    key={i}
                    onClick={link.onClick}
                    className="underline-offset-4 hover:underline cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={i}
                    href={link.href}
                    className="underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
