import { tabs, useTabContext } from "~/utils/context"

export const Tabs = () => {
  // tab and setTab are state. tabs is an array of possible tabs
  // want state in this component, but need it to change queries, dunno how to fix
  const { tab: currentTab, setTab } = useTabContext()

  return (
    <div className="flex border-b border-slate-600 pt-3">
      {tabs.map((tab, tabIdx) => (
        <button
          key={tabIdx}
          className={`flex w-1/2 grow justify-center pt-3 text-center text-dim hover:bg-hover-light dark:hover:bg-hover-dark`}
          onClick={() => setTab(tab)}
        >
          <div
            className={`pb-3 ${
              currentTab === tab
                ? "border-b-4 border-blue-500 font-bold text-slate-900 dark:text-slate-100"
                : ""
            }
              `}
          >
            {tab}
          </div>
        </button>
      ))}
    </div>
  )
}
