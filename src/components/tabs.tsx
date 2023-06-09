import { useTab, useToggleTab } from "~/utils/state"

export const Tabs = () => {
  // tab and setTab are state. tabs is an array of possible tabs
  // want state in this component, but need it to change queries, dunno how to fix
  const currentTab = useTab()
  const toggleTab = useToggleTab()

  const handleTabClick = (tab: string) => {
    if (tab !== currentTab) toggleTab()
  }

  return (
    <div className="flex border-b border-slate-600 pt-3">
      {["For you", "Following"].map((tab, tabIdx) => (
        <button
          key={tabIdx}
          className={`flex w-1/2 grow flex-col items-center pt-3 text-center text-dim hover:bg-hover-light dark:hover:bg-hover-dark`}
          onClick={() => handleTabClick(tab)}
        >
          <div className="flex flex-col items-center">
            <div
              className={`pb-3 ${
                currentTab === tab ? "font-bold text-slate-900 dark:text-slate-100" : ""
              }
              `}
            >
              {tab}
            </div>
            <div
              className={`h-1 ${
                currentTab === tab
                  ? "w-full rounded-xl bg-blue-500 transition-all duration-300 "
                  : "w-0"
              }
              `}
            />
          </div>
        </button>
      ))}
    </div>
  )
}
