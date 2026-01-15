import * as Accordion from '@radix-ui/react-accordion';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

interface AnimatedAccordionItem {
  title: string;
  content: string;
}

interface AnimatedAccordionProps {
  items: AnimatedAccordionItem[];
  type?: 'single' | 'multiple';
  collapsible?: boolean;
}

const AccordionContentWrapper = ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? height : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div ref={contentRef} className="pb-4 text-dark/70 dark:text-gray-400">
        {children}
      </div>
    </motion.div>
  );
};

const AnimatedAccordion = ({ 
  items, 
  type = 'single', 
  collapsible = true 
}: AnimatedAccordionProps) => {
  const [openValue, setOpenValue] = useState<string | string[] | undefined>(undefined);

  if (type === 'multiple') {
    return (
      <Accordion.Root
        type="multiple"
        className="w-full"
        value={openValue as string[] | undefined}
        onValueChange={(value: string[]) => setOpenValue(value)}
      >
        {items.map((item, index) => {
          const itemValue = `item-${index + 1}`;
          const isOpen = Array.isArray(openValue) && openValue.includes(itemValue);

          return (
            <Accordion.Item
              key={index}
              value={itemValue}
              className="border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between py-4 text-left font-medium text-dark dark:text-white hover:text-primary transition-colors focus:outline-none focus:ring-0 group data-[state=open]:text-primary">
                  <span>{item.title}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-primary"
                  >
                    <Icon
                      icon="solar:alt-arrow-down-linear"
                      className="text-xl"
                    />
                  </motion.div>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden">
                <AccordionContentWrapper isOpen={isOpen || false}>
                  {item.content}
                </AccordionContentWrapper>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    );
  }

  return (
    <Accordion.Root
      type="single"
      collapsible={collapsible}
      className="w-full"
      value={openValue as string | undefined}
      onValueChange={(value: string) => setOpenValue(value)}
    >
      {items.map((item, index) => {
        const itemValue = `item-${index + 1}`;
        const isOpen = type === 'single' 
          ? openValue === itemValue 
          : Array.isArray(openValue) && openValue.includes(itemValue);

        return (
          <Accordion.Item
            key={index}
            value={itemValue}
            className="border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between py-4 text-left font-medium text-dark dark:text-white hover:text-primary transition-colors focus:outline-none focus:ring-0 group data-[state=open]:text-primary">
                <span>{item.title}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-primary"
                >
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    className="text-xl"
                  />
                </motion.div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden">
              <AccordionContentWrapper isOpen={isOpen || false}>
                {item.content}
              </AccordionContentWrapper>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};

export default AnimatedAccordion;
